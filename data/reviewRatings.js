import { user, reviewRatings } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
let date = new Date(); // no params: current date and time of instantiation
import * as h from "../helpers.js";
import xss from "xss"; // input sanitization
const userCollection = await user();
const reviewRatingsCollection = await reviewRatings();


export const create = async (
  userId,
  revieweeId, // user GETTING reviewed
  // projectId, // project being reviewed
  rating,
  comment,
  firatName,
  lastName
  // createdAt  --> not sure needs to be passed in
) => {
  console.log(userId,revieweeId,rating,comment)
  // h.checkValidUserID(userId);
  // h.checkValidRevieweeId(revieweeId);
  // h.checkValidProjectId(projectId);
  // h.checkReview(comment);
  // h.selfReview(userId, revieweeId);
  // h.checkRating(rating);
  console.log(userId,revieweeId,rating,comment)
  rating = Math.round(rating * 10) / 10;

//  const sanitizedComment = xss(comment);

  const reviewee = await userCollection.findOne({
    _id: new ObjectId(revieweeId),
  });
console.log(reviewee)
  // move to helpers.js
  if (!reviewee)
    throw new Error(
      `A user with ID: ${revieweeId} does not exist in the database`
    );

  // const project = reviewee.projects.find((project) => project.id === projectId);
  // if (!project)
  //   throw new Error(
  //     `A project with ID of ${projectId} does not exist with the user specified`
  //   );

  // prevent duplicate insertion!! very important
  const reviewExists = await userCollection.findOne({
    userId: userId,
    revieweeId: revieweeId //,
    // projectId: projectId,
  });
  if (reviewExists)
    throw new Error(
      "It seems you've already left a review for this user"
    ); // iron this out.

  if (!reviewExists) {
    let newReviewId = new ObjectId();

    const reviewRatingsInfo = {
      _id: newReviewId,
      userId: userId,
      revieweeId: revieweeId,
      firatName:firatName,
      lastName:lastName,
      // projectId: projectId,
      rating: rating,
      comment: comment, // sanitizedComment,
      createdAt: date.toISOString(),
    };

    // procedure for accurate ratings calculation
    let ratingList = reviewee.reviews.map((review) => review.rating);
    let totalRating = ratingList.reduce(
      (accum, current_rating) => accum + current_rating,
      rating
    );
    ratingList = ratingList.concat(rating);
    console.log(totalRating,"vdhjwvsljlvhjd lhja lshjvbll",ratingList.length)
    const overallRating = totalRating / (ratingList.length); // + 1 corresponds to current review-rating (don't need one)
    const updatedUserReviews = await userCollection.updateOne(
      { _id: reviewee._id },
      {
        $push: { reviews: reviewRatingsInfo },
        $set: { overallRating: overallRating },
      }
    );

    if (updatedUserReviews.modifiedCount === 1) {

      const newReview = await reviewRatingsCollection.insertOne(
        reviewRatingsInfo
      );

      newReview._id = newReview.insertedId.toString();

      let reviewSuccess = await reviewRatingsCollection.findOne({
        _id: new ObjectId(newReview._id),
      });
      console.log(updatedUserReviews,"uur")
      return { reviewSuccess, success: true };
    } else {
      throw new Error("Review was not succesfully added");
    }
  }
};

export const getReviewByReviewId = async (id) => {

  const reviewRating = await reviewRatingsCollection.findOne({
    _id: new ObjectId(id),
  });
  if (!reviewRating) throw new Error("No review/rating with that id");
  reviewRating._id = reviewRating._id.toString();
  return reviewRating;
};

export const getReviewsByUser = async (userId) => {
  const reviews = await reviewRatingsCollection.find({ userId: userId }).toArray();
  reviews.forEach((review) => {
    review._id = review._id.toString();
  });
  return reviews;
};

export const checkReview = async (userId, revieweeId) => {
  const reviewExists = await reviewRatingsCollection.findOne({
    userId: userId,
    revieweeId: revieweeId
  });
  if (reviewExists) {
    return true;
    // return { alreadyReviewed: true };
  }
  else {
    return false;
    // return { alreadyReviewed: false };
  }
};

export const getAll = async (revieweeId) => {
  // console.log("in get all review")
  h.checkId(revieweeId);
  if (!ObjectId.isValid(revieweeId))
    throw new Error("revieweeId is not a valid ObjectId");

  const reviewsList = await reviewRatingsCollection.find({revieweeId: revieweeId}).toArray();
  if (!reviewsList) throw "this user was not found in our reviews collection. Perhaps they haven't been reviewed!";
  reviewsList.forEach((review) => {
    review._id = review._id.toString();
  });
  if (reviewsList.length === 0) {
    return [];
  }
  return { reviewsList, found: true };
};

export const remove = async (id) => {
  let result ={}
  console.log("in remove")
  if (!id) throw 'You must provide an id to search for';
  if (typeof id !== 'string') throw 'Id must be a string';
  if (id.trim().length === 0) throw 'id cannot be an empty string or just spaces';
  id = id.trim();
  if (!ObjectId.isValid(id)) throw 'invalid object ID';

// 

// let user = await userCollection.findOne({
//   reviews: { $elemMatch: { _id: new ObjectId(id) } },
// });

// if (!user) throw new Error("No user with that ID in the database");


let finalUser = await userCollection.updateOne({ "reviews._id" : new ObjectId(id)}, {$pull :{reviews:{_id:new ObjectId(id)}}})


let totalRating =0
let len =0
    for (const key in finalUser) {
      if(key === "reviews"){
        finalUser[key].forEach(element => {
          len = len+1
          totalRating = totalRating + element.rating
        });
      }
    }

    for (const key in finalUser) {
      if(key === "overallRating"){
        finalUser[key] = totalRating/len
        console.log(finalUser[key],"vhjv")
      }
    }
    let newUser = await userCollection.findOneAndReplace(
      { _id: new ObjectId(id)},
      finalUser
    );
    
  const deletionInfo = await reviewRatingsCollection.findOneAndDelete({
    _id: new ObjectId(id)
  });

  if (deletionInfo.lastErrorObject.n === 0) {
    throw `Could not delete review with id of ${id}`;
  }
  result["commentId"] = id
  result["deleted"] = true
  return result;
};

export const updateReview = async ( 
  reviewId, 
  newComment,
  newRating
) => {
  
  console.log("in update review!")
  h.checkId(reviewId)
  h.checkComment(newComment)

    let oldReview = await getReviewByReviewId(reviewId)
    console.log(oldReview)
    if(oldReview.comment === newComment && oldReview.rating === newRating) throw "Please make some change in comment to actually edit the review!"

    // console.log(name,"name")
    const newReviewsInfo ={
      userId:oldReview.userId,
      revieweeId:oldReview.revieweeId,
      firatName:oldReview.firatName,
      lastName:oldReview.lastName,
      rating:newRating,
      comment:newComment,
      createdAt: date.toISOString()

    }
   
    const user = await userCollection.findOne({
      reviews: { $elemMatch: { _id: new ObjectId(reviewId) } },
    });
    for (const key in user) {
      if(key === "reviews"){
        user[key].forEach(element => {
          if(element.userId === oldReview.userId){
            element.rating = newRating
            element.comment = newComment
          }
        });
      }
      
    }
    let userId = user._id.toString()
    let newUser = await userCollection.findOneAndReplace(
      { _id: new ObjectId(userId)},
      user
    );
    if (newUser.lastErrorObject.n === 0) throw [404, `Could not update the review with id ${reviewId}`];
    console.log("new user",user)
    let newReview = await reviewRatingsCollection.findOneAndReplace(
      { _id: new ObjectId(reviewId)},
      newReviewsInfo
    );
    if (newReview.lastErrorObject.n === 0) throw [404, `Could not update the review with id ${reviewId}`];
    

let totalRating =0
let len =0
    for (const key in user) {
      if(key === "reviews"){
        user[key].forEach(element => {
          len = len+1
          totalRating = totalRating + element.rating
        });
      }
    }

    for (const key in user) {
      if(key === "overallRating"){
        user[key] = totalRating/len
        console.log(user[key],"vhjv")
      }
    }
    newUser = await userCollection.findOneAndReplace(
      { _id: new ObjectId(userId)},
      user
    );
    if (newUser.lastErrorObject.n === 0) throw [404, `Could not update the review with id ${reviewId}`];

    return newReview.value;
};
