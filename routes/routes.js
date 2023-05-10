import { Router } from "express";
const router = Router();
import { userData } from "../data/index.js";
import xss from "xss";

router.route("/").get(async (req, res) => {
  const user = await userData(xss(req.body.user));
  let errorMessage = "";
  if (user) {
    if (user.role === "provider") {
      res.redirect("/providerHome");
    }
    if (user.role === "seeker") {
      res.redirect("/seekerHome");
    } else {
      errorMessage = "invalid role";
    }
  }
  if (!user) {
    res.redirect("/signup");
  }
});

export default router;
