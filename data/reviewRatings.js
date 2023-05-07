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
  comment
  // createdAt  --> not sure needs to be passed in
) => {
  h.checkValidUserID(userId);
  h.checkValidRevieweeId(revieweeId);
  // h.checkValidProjectId(projectId);
  h.checkReview(comment);
  h.selfReview(userId, revieweeId);
  h.checkRating(rating);

  rating = Math.round(rating * 10) / 10;

//  const sanitizedComment = xss(comment);

  const reviewee = await userCollection.findOne({
    _id: new ObjectId(revieweeId),
  });

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
    const overallRating = totalRating / (ratingList.length + 1); // + 1 corresponds to current review-rating
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
