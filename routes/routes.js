import { Router } from "express";
const router = Router();
import { userData } from "../data/index.js";
import xss from "xss";

router.route("/").get(async (req, res) => {
  const user = await userData(xss(req.body.user));
  let errorMessage = "";
  if (user) {
    if (user.role === "provider") {
      return res.redirect("/providerHome"); // placeholder redirect for now
    }
    if (user.role === "seeker") {
      return res.redirect("/seekerHome"); // same idea placeholder redirect
    } else {
      errorMessage = "invalid role";
    }
  }
  if (!user) {
    return res.redirect("/signup");
  }
});

export default router;

//I THINK THERE IS NO USE OF THIS CODE, BECAUSE WE ARE DOING THIS MIDDLEWARE FUNCTIONS.
