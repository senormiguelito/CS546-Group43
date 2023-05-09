import { user, reviewRatings } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
let date = new Date(); // no params: current date and time of instantiation
import * as h from "../helpers.js";
import xss from "xss"; // input sanitization
// import { compareSync } from "bcryptjs";
// import { compareSync } from "bcryptjs";
const userCollection = await user();
const reviewRatingsCollection = await reviewRatings();


export const create = async (
  userId,
  revieweeId, // user GETTING reviewed
  // projectId, // project being reviewed
  rating,
  comment,
  firatName,    // ugh this typo hurts my soul
  lastName
  // createdAt 
) => {
 try{

  rating = parseInt(rating)
  if(!rating) throw 'could not find rating'
  h.checkId(userId);
  h.checkId(revieweeId);  
  h.checkRating(rating);  //this check almost gave me heart attack, we're getting rating using form so it'll be in string
  h.checkReview(comment);
  // h.checkfirstname(firatName);
  // h.checklastname(lastName);
  h.selfReview(userId, revieweeId); 
  rating = Math.round(rating * 10) / 10;

  
  const reviewee = await userCollection.findOne({
    _id: new ObjectId(revieweeId),
  });

  // prevent duplicate insertion!! very important
  let reviewExists = await reviewRatingsCollection.findOne({
    _id: new ObjectId(revieweeId)
  })

  if (!reviewee)
    throw new Error(
      `A user with ID: ${revieweeId} does not exist in the database`
    );

    
  
  if (reviewExists)
    throw new Error(
      "It seems you've already left a review for this user"
    ); 

    
  if (!reviewExists) {
    let newReviewId = new ObjectId();

    const reviewRatingsInfo = {
      _id: newReviewId,
      userId: userId,
      revieweeId: revieweeId,
      firatName:firatName,
      lastName:lastName,
      rating: rating,
      comment: comment, 
      createdAt: date.toISOString(),
    };

    // procedure for accurate ratings calculation
    let ratingList = reviewee.reviews.map((review) => review.rating);
    let totalRating = ratingList.reduce(
      (accum, current_rating) => accum + current_rating,
      rating
    );
    ratingList = ratingList.concat(rating);
    
    const overallRating = totalRating / (ratingList.length); 
    
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

      return { reviewSuccess, success: true };
    } else {
      throw new Error("Review was not succesfully added");
    }
  }
}catch(e){
  throw e
}
};

export const getReviewByReviewId = async (id) => {

  h.checkId(id)
  const reviewRating = await reviewRatingsCollection.findOne({
    _id: new ObjectId(id),
  });
  if (!reviewRating) throw "No review/rating with that id";
  reviewRating._id = reviewRating._id.toString();

  return reviewRating;
};

export const getReviewsByUser = async (userId) => {

  h.checkValid(userId)
  const reviews = await reviewRatingsCollection.find({ userId: userId }).toArray();
  reviews.forEach((review) => {
    review._id = review._id.toString();
  });
  return reviews;
};

export const checkReview = async (userId, revieweeId) => {

  h.checkValid(userId)
  h.checkId(revieweeId)
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
  //id is reviewId in review rating collection
  let result ={}
  
  if (!id) throw 'You must provide an id to search for';
  if (typeof id !== 'string') throw 'Id must be a string';
  if (id.trim().length === 0) throw 'id cannot be an empty string or just spaces';
  id = id.trim();
  if (!ObjectId.isValid(id)) throw 'invalid object ID';

  let finalUser = await userCollection.updateOne({ "reviews._id": new ObjectId(id) }, { $pull: { reviews: { _id: new ObjectId(id) } } });
  if(finalUser.modifiedCount === 0) throw new Error("could not get the user with that review!")
 
  const reviewInfo = await reviewRatingsCollection.findOne({
    _id: new ObjectId(id)
  });
  if(!reviewInfo) throw new Error("could not find find the review in database")
  let userId = reviewInfo.revieweeId

  const user = await userCollection.findOne({
    _id: new ObjectId(userId)
  });
  if(!user) throw new Error("could not get a user to delete review!")
    const deletionInfo = await reviewRatingsCollection.findOneAndDelete({
      _id: new ObjectId(id)
    });
  
    if (deletionInfo.lastErrorObject.n === 0) {
      throw `Could not delete review in review collection with id of ${id}`;
    }

    if(user.reviews.length === 0){
      for (const key in user) {
        if(key === "overallRating"){
          user[key] = 0
        }
      }
      let newUser = await userCollection.findOneAndReplace(
        { _id: new ObjectId(userId)},
        user
      );
      if (newUser.lastErrorObject.n === 0) throw [404, `Could not update the overall rating with id ${id}`];
    }else{
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
        }
      }
      let newUser = await userCollection.findOneAndReplace(
        { _id: new ObjectId(userId)},
        user
      );
      if (newUser.lastErrorObject.n === 0) throw [404, `Could not update the overall rating with id ${id}`];
    }
  
  result["commentId"] = id;
  result["deleted"] = true;
  return result;
};

export const updateReview = async ( 
  reviewId, 
  newComment,
  newRating
) => {
  
  
  h.checkId(reviewId)
  h.checkComment(newComment)

    let oldReview = await getReviewByReviewId(reviewId)
    if(!oldReview) throw new Error("Could not find a review to update!")
    
    if(oldReview.comment === newComment && oldReview.rating === newRating) throw "Please make some change in comment to actually edit the review!"

    
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
    if(!user) throw new Error("could not find user with that review in database!")
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
      }
    }
   
    newUser = await userCollection.findOneAndReplace(
      { _id: new ObjectId(userId)},
      user
    );
    if (newUser.lastErrorObject.n === 0) throw [404, `Could not update the review with id ${reviewId}`];
    
    return newReview.value;
};
