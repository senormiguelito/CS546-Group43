import { posts } from "../config/mongoCollections.js";
import {ObjectId} from 'mongodb';
let d1 = new Date();
import * as h from "../helpers.js";

export const create = async ( title, description, location_city, location_state, location_zip_code, categories, budget, images) => {
  h.checkTitle(title);
  h.checkDescription(description);
  h.checkcity(location_city);
  h.checkstate(location_state);
  h.checkzipcode(location_zip_code);
  h.checkCategories(categories);
  h.checkbudget(budget);
  
  let seekerId = new ObjectId("64529868ae63cfc5d091c394").toString();

  if (seekerId.trim().length === 0) throw 'invalid id';
  if (!ObjectId.isValid(seekerId)) throw 'Invalid seekerId';

  //needs to check if images have valid img type

  // double check on providerId/seekerId!!!
  providerId = providerId.trim();
  seekerId = seekerId.trim();
  title = title.trim();
  description = description.trim();
  location_city = location_city.trim();
  location_state = location_state.trim();
  location_zip_code = location_zip_code.trim();

  const newPostsInfo = {
    seekerId: seekerId,
    title: title,
    description: description,
    location_city: location_city,
    location_state: location_state,
    location_zip_code: location_zip_code,
    categories: categories,
    budget: budget,
    role: "seeker", // double check on this!
    createdOrUpdatedAt: d1.toISOString(),
    images: []
  };
  
  const postsCollection = await posts();
  const insertInfo = await postsCollection.insertOne(newPostsInfo);
  if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add post';
  insertInfo._id = insertInfo.insertedId.toString();
  const newPost = await get(insertInfo.insertedId.toString());
  
  return newPost;
};

export const getAll = async () => {

  // console.log("inside data>posts>getAll");
  const postsCollection = await posts();
  let postList = await postsCollection.find({}).toArray();
  postList = postList.map((element) => {
    element._id = element._id.toString();
    // return element;
  });
  if (!postList) throw 'Could not get all posts'; // check if this is more appropriate method for return than below
  // if (postList.length === 0) {
  //   return [];
  // }
  return postList;
};

export const get = async (id) => {  // (postId)
  h.checkId(id);
  id = id.trim();
  const postsCollection = await posts();
  const post = await postsCollection.findOne({_id: new ObjectId(id)});
  if (!post) throw 'No post found in the database with that id';
  post._id = post._id.toString()

  return post;
};

export const remove = async (id) => { // (postId)
  h.checkId(id);
  id = id.trim();
  let result = {};
  
  const postsCollection = await posts()
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

  //needs to check if images have valid img type

  postId = postId.trim();
  seekerId = seekerId.trim();
  title = title.trim();
  description = description.trim();
  location_city = location_city.trim();
  location_state = location_state.trim();
  location_zip_code = location_zip_code.trim();

  const postsCollection = await posts();
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
    categories: categories,
    budget: budget,
    createdOrUpdatedAt: d1.toISOString(),
    images: []
  };

  let newPost = await postsCollection.findOneAndReplace(
    { _id: new ObjectId(postId) },
    newPostsInfo
  );
    
  if (newPost.lastErrorObject.n === 0) throw [404, `Could not update the post with id ${id}`];
  
  return newPost.value; // what is newPost.value?
};
