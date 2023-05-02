import { posts } from "../config/mongoCollections.js";
import {ObjectId} from 'mongodb';
let d1 = new Date();
import * as h from '../helpers.js';

export const create = async (
  seekerId,
  title,
  description,
  location,
  categories,
  budget,
  images) => {
  
  // // if seekerId, title, description, location, categories, budget are not provided at all, the method should throw.
  // if(!seekerId || !title || !description || !location || !categories || !budget) throw 'seekerId, title, description, location, categories, budget must be provided'

  // // if seekerId, title, description, location are not string, the method should throw.
  // if(typeof seekerId !=='string' ||typeof title !== 'string' || typeof description !== 'string' || typeof location !== 'string') throw 'seekerId, title, description, and location must be a string'

  // if(seekerId.trim().length === 0) throw 'invalid id'
  // // If the seekerId  provided is not a valid ObjectId, the method should throw.
  // if(!ObjectId.isValid(seekerId)) throw 'Invalid seekerId'

  // // if title, description, location are empty string, the method should throw.
  // if(title.trim().length === 0 || description.trim().length === 0 || location.trim().length === 0) throw 'title, description, and location must be a non-empty string'

  // // if categories is not an array of string, method should throw.
  // if(!Array.isArray(categories)) throw 'categories must be an array'

  // // if categories have an non-string or an empty string, method should throw.
  // categories.forEach(element => {
  //   if(typeof element === 'string'){
  //     if(element.trim().length === 0) throw 'categories can not have an empty string'
  //     element = element.trim()
  //   }else{
  //     throw 'categories must be an array of strings'
  //   }
  // });

  // //if budget is a negative number, method should throw.
  // if (typeof budget !== 'number') throw 'budget should be a valid number'
  // if(budget <= 0) throw 'how come your budget is zero or less?'

  //needs to check if images have valid img type


  seekerId = seekerId.trim()
  title = title.trim()
  description = description.trim()
  location = location.trim()

  const newPostsInfo ={
    seekerId:seekerId,
    title:title,
    description:description,
    location:location,
    categories:categories,
    budget:budget,
    createdOrUpdatedAt:d1.toISOString(),
    images:[]
  }
  
    const postsCollection = await posts()
    const insertInfo = await postsCollection.insertOne(newPostsInfo)
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw new Error('Could not add post');
    insertInfo._id = insertInfo.insertedId.toString()
    const newPost = await get(insertInfo.insertedId.toString());
    return newPost;
};

export const getAll = async () => {
  // console.log("inside data > posts > getAll");
  const postsCollection = await posts();
  let postList = await postsCollection.find({}).toArray();
  if (!postList) throw new Error('Could not get all posts');
  
  postList = postList.map((element) => {
    element._id = element._id.toString();
    return element;
  });

  return postList;
};

export const get = async (id) => {
  
    if (!id) throw 'You must provide an id to search for';
    if (typeof id !== 'string') throw 'Id must be a string data>posts';
    if (id.trim().length === 0) throw 'id cannot be an empty string or just spaces';
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'invalid object ID';
    
    const postsCollection = await posts()
    const post = await postsCollection.findOne({_id: new ObjectId(id)});
    if (!post) throw 'No post with that id';
    post._id = post._id.toString()
    return post;
  };

export const remove = async (id) => {
  let result = {};
  if (!id) throw new Error('You must provide an id to search for');
  if (typeof id !== 'string') throw new Error('Id must be a string');
  if (id.trim().length === 0) throw new Error('id cannot be an empty string or just spaces');
  id = id.trim();
  if (!ObjectId.isValid(id)) throw new Error("invalid object ID");

  const postsCollection = await posts()
  const deletionInfo = await postsCollection.findOneAndDelete({
    _id: new ObjectId(id)
  });

  if (deletionInfo.lastErrorObject.n === 0) throw new Error(`Could not delete post with id of ${id}`);

  result["postId"] = id;
  result["deleted"] = true;
  return result;
};

export const update = async (postId,
  seekerId,
  title,
  description,
  location,
  categories,
  budget,
  images
) => {
  // if postId, seekerId, title, description, location, categories, budget are not provided at all, the method should throw.
  if (!postId || !seekerId || !title || !description || !location || !categories || !budget) throw new Error('postId, seekerId, title, description, location, categories, budget must be provided');

  // if postId, seekerId, title, description, location are not string, the method should throw.
  if (typeof postId !== 'string' || typeof seekerId !== 'string' || typeof title !== 'string' || typeof description !== 'string' || typeof location !== 'string') throw new Error('postId, seekerId, title, description, and location must be a string');

  // if  postId, seekerId, title, description, location are empty string, the method should throw.
  if (postId.trim().length === 0 || seekerId.trim().length === 0 || title.trim().length === 0 || description.trim().length === 0 || location.trim().length === 0) throw new Error('postId, seekerId, title, description, and location must be a non-empty string');

  // If the postId and seekerId  provided are not a valid ObjectId, the method should throw.
  if (!ObjectId.isValid(postId) || !ObjectId.isValid(seekerId)) throw new Error('Invalid postId or seekerId');

  // if categories is not an array of string, method should throw.
  if (!Array.isArray(categories)) throw new Error('categories must be an array');

  // if categories have an non-string or an empty string, method should throw.
  categories.forEach(element => {
    if (typeof element === 'string') {
      if (element.trim().length === 0) throw new Error('categories can not have an empty string');
      element = element.trim();
    } else {
      throw new Error('categories must be an array of strings');
    }
  });

  //if budget is a negative number, method should throw.
  if (typeof budget !== 'number') throw new Error('budget should be a valid number');
  if (budget <= 0) throw ('budget must be a postive number');
  //needs to check if images have valid img type

  postId = postId.trim();
  seekerId = seekerId.trim();
  title = title.trim();
  description = description.trim();
  location = location.trim();

  const postsCollection = await posts();
  let oldPost = await get(postId);

  if (oldPost.seekerId !== seekerId) throw new Error("You can only update a post which you've created");
  //  postId, seekerId, title, description, location, categories, budget, images
  if (oldPost.title === title && oldPost.description === description && oldPost.location === location && JSON.stringify(oldPost.categories) === JSON.stringify(categories) && oldPost.budget === budget)
    throw ('No change noticed. Nothing to update');

  const newPostsInfo = {
    seekerId: seekerId,
    title: title,
    description: description,
    location: location,
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

  return newPost.value;
};