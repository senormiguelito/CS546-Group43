import { posts } from "../config/mongoCollections.js";
import {ObjectId} from 'mongodb';
import session from "express-session";
let d1 = new Date();
import * as h from "../helpers.js";
const postsCollection = await posts();

export const create = async (userId, title, description, budget, role, categories, location_zip_code, location_city, location_state, images) => {
  // title, description, budget, role, categories, zip, city, state
  h.checkValid(userId)
  h.checkTitle(title);
  h.checkDescription(description);
  h.checkcity(location_city);
  h.checkstate(location_state);
  h.checkzipcode(location_zip_code);
  // h.checkCategories(categories);
  h.checkbudget(budget);
  console.log("In create post data ")

  //needs to check if images have valid img type


  userId = userId.trim();
  title = title.trim();
  description = description.trim();
  location_city = location_city.trim();
  location_state = location_state.trim();
  location_zip_code = location_zip_code.trim();

  // title, description, budget, role, categories, zip, city, state
  
  const newPostsInfo = {
    userId: userId,
    title: title,
    description: description,
    budget: budget,
    role: role, 
    categories: categories,
    location_city: location_city,
    location_state: location_state,
    location_zip_code: location_zip_code,
    createdOrUpdatedAt: d1.toISOString(),
    images: [],
    prospects: []   // Empty prospects array --> User interaction will push that user into the prospects array. 
                    // When poster decides on whos the right fit, select that prospect from the drop down ---> this will create the 'project'
  };
  
  const insertInfo = await postsCollection.insertOne(newPostsInfo);
  if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add post';
  insertInfo._id = insertInfo.insertedId.toString();
  const newPost = await get(insertInfo.insertedId.toString());

  return {newPost, insertedPost: true};
};

export const getAll = async () => {

  // console.log("inside data>posts>getAll");
  let postList = await postsCollection.find({}).toArray();
  postList = postList.map((element) => {
    element._id = element._id.toString();
    return element;
  });
  if (!postList) throw 'Could not get all posts'; 
  return postList;
};

export const getAllPostsByUser = async (userId) => {
  h.checkId(userId);

  if (!ObjectId.isValid(userId)) throw new Error("invalid userId");
  userId = userId.trim();

  let posts = await postsCollection.find({ userId: new ObjectId(userId) }).toArray(); //gets all post with the userId parameter in
  console.log(posts);
  if (!posts) {
    return [];
  } else {
    posts = posts.map((post) => {
      post._id = post._id.toString();
      return post;
    });
    // return posts;
  }
};

export const get = async (id) => {  // (postId)
  h.checkId(id);
  id = id.trim();
  const post = await postsCollection.findOne({_id: new ObjectId(id)});
  if (!post) throw 'No post found in the database with that id';
  post._id = post._id.toString()

  return post;
};

export const remove = async (id) => { // (postId)
  h.checkId(id);
  id = id.trim();
  let result = {};
  
  const deletionInfo = await postsCollection.findOneAndDelete({ _id: new ObjectId(id) });
  
  if (deletionInfo.lastErrorObject.n === 0) throw `Could not delete post with id of ${id}`;
  
  result["postId"] = id
  result["deleted"] = true
  return result;

};

export const update = async (postId, seekerId, title, description, location_city, location_state, location_zip_code, categories, budget, images) => {
  h.checkId(postId);
  h.checkId(seekerId);
  h.checkTitle(title);
  h.checkDescription(description);
  h.checkcity(location_city);
  h.checkstate(location_state);
  h.checkzipcode(location_zip_code);
  h.checkCategories(categories);
  h.checkbudget(budget);

  //this is different than helper function. don't delete it.
  if (!categories) throw new Error("categories not provided");
        
  if (!Array.isArray(categories))
    throw new Error("Update: categories must be an array");
    
  const filteredCategories = categories.filter(element => {
    return element !== '';
  });
  
  if (filteredCategories.length < 1)
    throw new Error("Update: you must supply at least 1 category");
  for (let i in filteredCategories) {
    if (typeof filteredCategories[i] !== "string")
      throw new Error("Update: each category must be a string");
    filteredCategories[i] = filteredCategories[i].trim();
    for (let j in filteredCategories[i]) {
      if (typeof filteredCategories[i][j] === "number")
      throw new Error("Update: invalid category response");
    }
  }
  //needs to check if images have valid img type

  postId = postId.trim();
  seekerId = seekerId.trim();
  title = title.trim();
  description = description.trim();
  location_city = location_city.trim();
  location_state = location_state.trim();
  location_zip_code = location_zip_code.trim();

  let oldPost = await get(postId);

  if (oldPost.seekerId !== seekerId) throw "You can only update a post which you've created";
  // postId, seekerId, title, description, location, categories, budget, images
  if (oldPost.title === title && oldPost.description === description && oldPost.location_city === location_city && oldPost.location_state === location_state && oldPost.location_zip_code === location_zip_code && JSON.stringify(oldPost.categories) === JSON.stringify(categories) && oldPost.budget === budget)
    throw 'You must change part of the document to submit an update request';

  const newPostsInfo = {
    seekerId: seekerId,
    title: title,
    description: description,
    location_city: location_city,
    location_state: location_state,
    location_zip_code: location_zip_code,
    categories: filteredCategories,
    budget: budget,
    createdOrUpdatedAt: d1.toISOString(),
    images: []
  };

  let newPost = await postsCollection.findOneAndReplace(
    { _id: new ObjectId(postId) },
    newPostsInfo
  );
    
  if (newPost.lastErrorObject.n === 0) throw [404, `Could not update the post with id ${id}`];
  
  return newPost.value; 
};

export const getByCommentId = async (id) => {

  h.checkId(id);
  id = id.trim();
  const post = await postsCollection.findOne({comments :{ $elemMatch: {_id : new ObjectId(id) }}});
 
  if (!post) throw 'No band with that id';
  // post._id = post._id.toString()
  return post;
};

export const getByRole = async (role) => {

  // h.checkId(id);
  // id = id.trim();
  console.log("in get by role data")

  let postList = await postsCollection.find({}).toArray();
  postList = postList.map((element) => {
    // console.log(element.role, role)
    if(element.role === role){
      element._id = element._id.toString();
      return element;
    }
  });
  if (!postList) throw 'Could not get all posts'; 
  postList = postList.filter(function( element ) {
    return element !== undefined;
  });
//  console.log(postList, "postList");
  return postList;

  // const postsCollection = await posts();
  // const post = await postsCollection.find({role: role});
  // if (!post) throw 'No post found in the database with that id';
  // post._id = post._id.toString()

  // return post;
};