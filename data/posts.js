import { posts } from "../config/mongoCollections.js";
import {ObjectId} from 'mongodb';
let d1 = new Date()

const create = async (
    seekerId,
    title,
    description,
    location,
    categories,
    budget,
    updatedAt,
    images
        
  ) => {
  
 
    const postsInfo ={
        seekerId:seekerId,
    title:title,
    description:description,
    location:location,
    categories:categories,
    budget:budget,
    createdAt:d1.toISOString(),
    updatedAt:"",
    images:[]
    }
  
    const postsCollection = await posts()
    const insertInfo = await postsCollection.insertOne(postsInfo)
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw 'Could not add post';
    insertInfo._id = insertInfo.insertedId.toString()
    const newPost = await get(insertInfo.insertedId.toString());
    return newPost;
  };

  const get = async (id) => {
  
    const postsCollection = await posts()
    const post = await postsCollection.findOne({_id: new ObjectId(id)});
    if (!post) throw 'No post with that id';
    post._id = post._id.toString()
    return post;
  };

  export {create,get}