import { postData, postComment } from "../data/index.js";
import { Router } from "express";
import { ObjectId } from "mongodb";
import * as h from "../helpers.js";
import { messageData } from "../data/index.js";
import { userData } from "../data/index.js";
import xss from "xss";
const router = Router();
import multer from "multer";

router.route("/").get(async (req, res) => {
  try {
    let posts = await postData.getAll();
    // console.log("in create post");
    res.render("post", { posts: posts });
  } catch (e) {
    return res.status(400).render("400", { error: e });
  }
});

router.route("/myPosts").get(async (req, res) => {
  try {
    let userId = req.session.user.userID;
    let myPosts = await postData.getAllPostsByUser(userId);
    let Message;
    if (req.session.successMessage) Message = req.session.successMessage;
    req.session.successMessage = null; // clear the session variable
    res.render("myPost", {
      title: "Here Are All Your Posts!",
      posts: myPosts,
      Message,
    });
  } catch (e) {
    let error;
    if (req.session.errorMessage) {
      error = req.session.errorMessage;
      req.session.errorMessage = null;
    } // clear the session variable
    else error = e;
    return res.status(400).render("myPost", { Error: error });
  }
});

router.route("/newPost/createPost").get(async (req, res) => {
  try {
    // console.log("in create post");
    res.render("create_post");
  } catch (e) {
    return res.status(400).render("404", { error: e });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/post");
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, file.fieldname + "-" + Date.now() + "." + ext);
  },
});

const upload = multer({ storage: storage });
router.route("/createPost").post(upload.single("image"), async (req, res) => {
  try {
    console.log("in /createPost route");
    // console.log(req.body.categorydata);
    let title = xss(req.body.titleInput);
    let description = xss(req.body.descriptionInput);
    let budget = xss(req.body.budgetInput);
    let role = xss(req.body.roleInput);
    let categories = xss(req.body.categorydata);
    let zip = xss(req.body.zipInput);
    let city = xss(req.body.cityInput);
    let state = xss(req.body.stateInput);
    let userId = req.session.user.userID;
    const arrCategories = categories
      .split(",")
      .map((s) => s.trim().replace(/"/g, "")); // convert categories from html into array
    // console.log(arrCategories);
    let imageData = "";
    // console.log(req.file);
    if (req.file) {
      imageData =
        "http://localhost:3000/public/images/post/" + req.file.filename;
    } else {
      throw "image is not inserted, it is reuired.";
    }
    // console.log(imageData);

    h.checkTitle(title);
    h.checkDescription(description);
    h.checkbudget(budget);
    h.checkrole(role);
    h.checkzipcode(zip);
    h.checkcity(city);
    h.checkstate(state);
    h.checkValid(userId);
    // console.log(title, description, budget, role, categories, zip, city, state)
    let newPost = await postData.create(
      userId,
      title,
      description,
      budget,
      role,
      arrCategories,
      zip,
      city,
      state,
      imageData
    );

    if (newPost.insertedPost) {
      const userID = req.session.user.userID;
      req.session.post = { Created: true, userID };
      res.status(200).redirect("/post/myposts");
    } else {
      throw "could not create new post";
    }
    // res.redirect('/')
  } catch (e) {
    return res.status(400).render("create_post", { Error: e });
  }
});

// router.route('/filter').post(async (req, res) => {
//   console.log(req.params, req.body)
//   let role = xss(req.body.filter);
//   console.log("in filter route")
//   if (role === 'all') {
//     let posts = await postData.getAll()
//     return res.render('home', { posts: posts })
//   }
//   else {
//     let posts = await postData.getByRole(role)
//     return res.render("home", { posts: posts });
//   }

// });

router.route("/:postId/interested").post(async (req, res) => {
  // console.log(req.params,req.body)
  // console.log(req.session)
  let role = xss(req.body.filter);
  let postId = req.params.postId;

  console.log("in interested route");
  try {
    let post = await postData.get(postId);
    // console.log(post);
    if (!post) throw new Error("Post was not found");
    post.prospects = post.prospects.push({
      userId: req.session.user._id,
      firstName: req.session.user.firstName,
      lastName: req.session.user.lastName,
      email: req.session.user.emailAddress,
      userCity: req.session.user.location_city,
    });

    const updatedPost = await postData.update(
      postId,
      post.userId,
      post.title,
      post.description,
      post.location_city,
      post.location_state,
      post.location_zip_code,
      post.categories,
      post.budget,
      post.images,
      post.prospects
    );

    //it is redirecting back to same page so you might feel weather or not something happened
    if (updatedPost) {
      return res.redirect("/post/postId");
      //      return res.status(200).render("post/postId");
    }
  } catch (e) {
    res.status(400).render("error", { error: e });
  }
});

router.route("/filter").post(async (req, res) => {
  // console.log(req.params, req.body);
  let role = req.body.filter;
  console.log("in filter route");
  if (role === "all") {
    let posts = await postData.getAll();
    return res.render("home", { posts: posts });
  } else {
    let posts = await postData.getByRole(role);
    return res.render("home", { posts: posts });
  }
});

router.route("/:postId").get(async (req, res) => {
  try {
    let postId = xss(req.params.postId);
    let post = await postData.get(postId);

    h.checkId(postId);
    if (!post) throw "could not find post with that id";
    let comms = await postComment.getAll(postId);
    // okay so need a way to show number of people interested
    let interestCount = post.prospects.length;

    if (!comms) {
      return res.render("post", { post: post, interestCount: interestCount });
    } else {
      return res.render("post", {
        post: post,
        comms: comms,
        interestCount: interestCount,
      });
    }
  } catch (e) {
    return res.status(400).render("404", { error: e });
  }
});

router.route("/:postId/comment").post(async (req, res) => {
  try {
    let userId = req.session.user.userID;
    let comm = req.body.postCommentInput;
    let postId = xss(req.params.postId);
    h.checkId(userId);
    h.checkId(postId);

    if (!comm) throw "please enter comment!";
    if (comm.trim().length === 0) throw "please enter non-empty comment!";

    postId = postId.trim();
    userId = userId.trim();
    comm = comm.trim();

    let comment = await postComment.create(userId, postId, comm);
    if (!comment) throw "could not add comment";

    return res.redirect(`/post/${postId}`);
    // return res.render('home', {comment:comment})
  } catch (e) {
    return res.status(400).render("404", { error: e });
  }
});

// needs to change method from get to delete
router.route("/:commentId/deleteComment").get(async (req, res) => {
  try {
    let userId = req.session.user.userID;
    let commentId = xss(req.params.commentId);

    h.checkValid(userId);
    h.checkId(commentId);
    userId = userId.trim();
    commentId = commentId.trim();
    let postByCommentId = await postData.getByCommentId(commentId);
    if (!postByCommentId) throw "could not find user with that comment";
    let deletedComment = await postComment.remove(userId, commentId);
    if (deletedComment)
      return res.redirect(`/post/${postByCommentId._id.toString()}`);
    if (!deletedComment) throw "could not delete comment";
    // res.redirect(`/post/${postByCommentId._id.toString()}`)
    // res.json(req.params);
  } catch (e) {
    return res.status(400).render("404", { error: e });
  }
});

router.route("/:postId/delete").get(async (req, res) => {
  try {
    let userId = req.session.user.userID;
    let postId = xss(req.params.postId);

    h.checkValid(userId);
    h.checkId(postId);
    userId = userId.trim();
    postId = postId.trim();
    let postByPostId = await postData.get(postId);
    if (!postByPostId) throw "could not find user with that postId";
    if (postByPostId.userId !== userId) {
      throw "userId and postId is not matched";
    }
    let deletedPost = await postData.remove(postId);
    req.session.successMessage = `Post(${deletedPost.postId}) deleted successfully`;
    if (deletedPost.deleted) return res.redirect(`/post/myposts`);
    else throw `could not delete this post : ${postId}`;
  } catch (e) {
    req.session.errorMessage = `Post(${postId}) is not deleted successfully`;
    return res.redirect(`/post/myposts`);
  }
});

export default router;
