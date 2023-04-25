import { Router } from "express";
const router = Router();

router.get("/user", async (req, res) => {
  try {
    res.render("home", { title: "Homepage" });
  } catch (e) {
    res.sendStatus(500).redirect("/error");
  }
});

router
  .get("/login", async (req, res) => {
    try {
      res.render("login", { title: "Login" });
    } catch (e) {
      res.sendStatus(500).redirect("/user");
    }
  })
  .post(async (req, res) => {
    //code here for POST
  });

router
  .get("/signup", async (req, res) => {
    try {
      res.render("sign-up", { title: "Registration" });
    } catch (e) {
      res.sendStatus(500).redirect("/user");
    }
  })
  .post(async (req, res) => {
    //code here for POST
  });

export default router;
