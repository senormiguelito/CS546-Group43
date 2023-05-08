import { Router } from "express";
const router = Router();
import * as h from "../helpers.js";
import { userData } from "../data/index.js";
import { reviewData } from "../data/index.js";
import xss from "xss";

router.route("/:userId").post(async (req, res) => {

  const reviewee = req.params.userId;
  const reviewer = req.session.user.userID;
  try {
    h.checkId(reviewee);
    h.checkId(reviewer);

    console.log("reviewee")
    console.log(reviewee);
    console.log(reviewer)

    console.log("20 /user/reviews/ route");
    const reviewExists = await reviewData.checkReview(reviewer, reviewee);

    if (reviewExists) {
      // badInput = true;
      console.log("25 bc reviewExists")
      throw new Error("You have already reviewed this user!");
    }
  } catch (e) {
    return res.status(400).render("../home", { badInput: true, error: e });
  }

  try {
    if (req.session.user) {
      const rating = xss(req.body.rating);
      const review = xss(req.body.review);

      const thisReview = await reviewData.create(reviewer, reviewee, rating, review);
      // console.log("thisReview is problem")
      if (thisReview.success) {
        console.log("it worked, bad link");
        return res.redirect(`/${reviewee}`);
      }
    } else {
      res.redirect("/login");
    }
  } catch (e) {
    res.status(500).render("error", { error: "Internal Server Error" });
  }
});

router.route("/:userId/allReviews").get(async (req, res) => {
  try {
    const reviews = await getAll(userId);
    if (found) {
      res.status(200).render("reviews", {reviews: reviews, found: true})      
    }
    else {
      badInput = true;
      throw new Error("no reviews were found for the given user :( ");
    }
  } catch (e) {
    return res.render("error", { error: e });
  }
})


export default router;