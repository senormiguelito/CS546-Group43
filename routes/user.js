import { Router } from "express";
const router = Router();

router.get("/login", async (req, res) => {
  try {
    res.render("login", { title: "Login" });
  } catch (e) {
    res.sendStatus(500).redirect("/user");
  }
});

export default router;
