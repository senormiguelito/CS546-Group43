import { reviewRatings } from "../config/mongoCollections.js";
import {ObjectId} from 'mongodb';
let d1 = new Date()
const create = async (
    userId,
    revieweeId,
    projectId,
    rating,
    comment
  ) => {
  
 
    const reviewRatingsInfo ={
        userId:userId,
        revieweeId:revieweeId,
        projectId:projectId,
        rating:rating,
        comment:comment,
        createdAt:d1.toISOString()
    }
  
    const reviewRatingsCollection = await reviewRatings()
    const insertInfo = await reviewRatingsCollection.insertOne(reviewRatingsInfo)
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw 'Could not add review ratings';
    insertInfo._id = insertInfo.insertedId.toString()
    const newReviewRating = await get(insertInfo.insertedId.toString());
    return newReviewRating;
  };

  const get = async (id) => {
  
    const reviewRatingsCollection = await reviewRatings()
    const reviewRating = await reviewRatingsCollection.findOne({_id: new ObjectId(id)});
    if (!reviewRating) throw 'No review/rating with that id';
    reviewRating._id = reviewRating._id.toString()
    return reviewRating;
  };

  export {create,get}