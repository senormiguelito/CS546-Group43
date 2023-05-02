import { Router } from "express";
const router = Router();
import userData from '../data/index.js';

router.route("/").get(async (req, res) => {
  const user = await userData(req.body.user);
  let errorMessage = "";
  if (user) {
    if (user.role === "provider") {
      res.redirect('/providerHome');    // placeholder redirect for now
    }
    if (user.role === "seeker") {
      res.redirect('/seekerHome');      // same idea placeholder redirect
    }
    else {
      errorMessage = "invalid role";
    }
  }
  if (!user) {
    res.redirect('/signup')
  }
});


export default router;