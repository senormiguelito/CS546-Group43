import { Router } from "express";
const router = Router();

router.route("/").get(async (req, res) => {
    try {
      res.render("home");
    } catch (e) {
      return res.status(400).render("error", { error: e });
    }
  });

  router.route("/provideList").get(async (req, res) => {
    try {
      res.render("providerlist");
    } catch (e) {
      return res.status(400).render("error", { error: e });
    }
  }); 
export default router;