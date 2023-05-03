import { postData } from "../data/index.js";
import { Router } from "express";
import { messageData } from "../data/index.js";
const router = Router();

router.route("/").get(async (req, res) => {
  try {
    let posts = await postData.getAll();
    // console.log(posts.title, posts.description)
    // console.log(posts)
    let message = "";
    if (req.session.user) {
      message = `Hey ${req.session.user.firstName},This is your user ID : ${req.session.user.userID}`;
    } else {
      message = `hey you entered without login!!!, how???`;
    }

    res.render("home", { posts: posts, Message: message });
  } catch (e) {
    return res.status(400).render("home", { error: e });
  }
});

router.route("/provideList").get(async (req, res) => {
  try {
    res.render("providerlist");
  } catch (e) {
    return res.status(400).render("error", { error: e });
  }
});

router.route("/messages").get(async (req, res) => {
  const messages = await messageData.getAllMessages();
  console.log(messages);
  res.render("dmList", { title: "messages", messages: messages });
});

router.route("/myprofile").get(async (req, res) => {
  res.render("myprofile", { title: "Profile" });
});
export default router;
