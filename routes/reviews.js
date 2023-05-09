import { raw, Router } from "express";
const router = Router();
import * as h from "../helpers.js";
import { userData } from "../data/index.js";
import { reviewData } from "../data/index.js";
import xss from "xss";
import { ConnectionPoolClosedEvent } from "mongodb";
import e from "connect-flash";

router.route("/:userId").post(async (req, res) => {

  const reviewee = req.params.userId;
  const reviewer = req.session.user.userID;
  let reviewerFirstName = req.session.user.userSessionData.firstName;
  let reviewerLastName = req.session.user.userSessionData.lastName;
  try {
    h.checkId(reviewee);
    h.checkId(reviewer);
    
    h.selfReview(reviewee, reviewer);

    console.log("reviewee: ");
    console.log(reviewee);
    console.log(reviewer);

    console.log("20 /user/reviews/ route");
    const reviewExists = await reviewData.checkReview(reviewer, reviewee);
    console.log(reviewExists);
    if (reviewExists) {
      // badInput = true;
      return res.status(400).render("reviews", {error:"You have already reviewed this user!"})
    }
  } catch (e) {
    return res.status(400).render("../home", { badInput: true, error: e });
  }

  try {
    if (req.session.user) {
      const rating = xss(req.body.ratingInput);
      const review = xss(req.body.reviewInput);

      const thisReview = await reviewData.create(reviewer, reviewee, rating, review, reviewerFirstName, reviewerLastName);
      if (thisReview.success) {
        console.log(thisReview)
        // isn't linking correctly
        return res.redirect(`../../profile/${reviewee}`);
        
      }
    } else {
      return res.redirect("/login");
    }
  } catch (e) {
    return res.status(500).render("error", { error: "Internal Server Error" });
  }
});

router.route("/:userId/allReviews").get(async (req, res) => {
  try {
    console.log("in all review route")
    console.log(req.params, req.body)
    let userId = req.params.userId
    const reviews = await reviewData.getAll(userId);

    // this is where we will allow the session user to view all the reviews that have been left on them
    // if (req.session.user.userID.toString().trim() === userId) {
    //   return res.status(200).render("reviews")
    // }

    if (reviews.reviewsList) {
      return res.status(200).render("reviews", { reviews: reviews.reviewsList, found: true })
    }
    else {
      badInput = true;
      return res.status(400).render("reviews", { error: "no reviews were found for the given user :( " });
    }
  } catch (e) {
    return res.status(400).render("reviews", { error: "no reviews were found for the given user :( " });
    // return res.send("profile", {error:"could not find any review!!!!"})
    
  }
});

router.route("/delete/:reviewId").post(async (req, res) => {
  try {
    let currentUser = req.session.user.userID;
    let reviewId = req.params.reviewId;
    let review = await reviewData.getReviewByReviewId(reviewId);

    let deletedReview = undefined;
    if (currentUser === review.userId) {
      deletedReview = await reviewData.remove(reviewId);
      console.log("deleted review", deletedReview);
      if (deletedReview.deleted === true) {
        return res.redirect(`/../../user/reviews/${review.revieweeId}/allReviews`);
      }
    } else {
      return res.render('reviews', { msg: "can not deleted someone elses review!" });
    }
   
  } catch (e) {
    return res.render('reviews', { msg: e });
  }
});

router.route("/edit/:reviewId").post(async (req, res) => {
  try {
    let currentUser = req.session.user.userID;
    let reviewId = req.params.reviewId;
    let newComment = req.body.editReviewInput;
    let newRating = req.body.editRatingInput;

    newRating = parseInt(newRating);

    let review = await reviewData.getReviewByReviewId(reviewId);
    if (review.userId !== currentUser) {
      return res.render('reviews', { msg: "You can not delete someone else's review!" });
    }

    let updatedReview = await reviewData.updateReview(reviewId, newComment, newRating);
    console.log("118editreviewRoute", updatedReview);
    return res.redirect(`/../../user/reviews/${review.revieweeId}/allReviews`);
   
  } catch (e) {
    return res.render('reviews', { msg: e });
  }
})

export default router;