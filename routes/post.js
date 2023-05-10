import { postData, postComment, projectData } from "../data/index.js";
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

    return res.render("post", { posts: posts });
  } catch (e) {
    return res.status(400).render("justError", { error: e });
  }
});

router.route("/myPosts").get(async (req, res) => {
  try {
    let userId = req.session.user.userID;
    let myPosts = await postData.getAllPostsByUser(userId);
    let Message;
    if (req.session.successMessage) Message = req.session.successMessage;
    req.session.successMessage = null; // clear the session variable
    return res.render("myPost", {
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
    return res.render("create_post");
  } catch (e) {
    return res.status(400).render("justError", { error: e });
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

    let imageData = "";

    if (req.file) {
      imageData =
        "http://localhost:3000/public/images/post/" + req.file.filename;
    } else {
      throw "image is not inserted, it is reuired.";
    }

    h.checkTitle(title);
    h.checkDescription(description);
    h.checkbudget(budget);
    h.checkrole(role);
    h.checkzipcode(zip);
    h.checkcity(city);
    h.checkstate(state);
    h.checkValid(userId);

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
      return res.status(200).redirect("/post/myposts");
    } else {
      throw "could not create new post";
    }

  } catch (e) {
    return res.status(400).render("create_post", { Error: e });
  }
});

router.route("/:postId/interested").put(async (req, res) => {
  let role = xss(req.body.filter);
  let postId = req.params.postId;

  try {
    let post = await postData.get(postId);

    if (!post) throw new Error("Post was not found");
    let prospectpush = {};

    if (!post.comments) {
      post.comments = [];
    }

    prospectpush["userId"] = req.session.user.userID;
    prospectpush["firstName"] = req.session.user.userSessionData.firstName;
    prospectpush["lastName"] = req.session.user.userSessionData.lastName;
    prospectpush["role"] = req.session.user.userSessionData.role;
    prospectpush["email"] = req.session.user.userSessionData.emailAddress;
    prospectpush["userCity"] = req.session.user.userSessionData.location_city;

    post.prospects.push(prospectpush);

    const updatedPost = await postData.update(
      postId,
      post.userId,
      post.title,
      post.description,
      post.role,
      post.location_city,
      post.location_state,
      post.location_zip_code,
      post.categories,
      post.budget,
      post.images,
      post.prospects,
      post.comments,
      req.session.user.userID.toString()
    );

    if (updatedPost) {
      let comms = await postComment.getAll(postId);
      // okay so need a way to show number of people interested
      let interestCount = updatedPost.prospects.length + 1;

      // return res.render("post", {
      //   post: post,
      //   comms: comms,
      //   interestCount: interestCount,
      // });
      req.session.user = { interestedUpdated: true, post, comms, interestCount, postId };
      return res.redirect(`/post/${postId}`);
    }
  } catch (e) {
    res.status(400).render("error", { error: e , badInput: true}); // thi won't work ig
  }
});

router.route("/filter").get(async (req, res) => {

  let role = xss(req.body.filter); 

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
    if (req.session.user.interestedUpdated) {
      let post = req.session.user.post;
      let comms = req.session.user.comms;
      let interestCount = req.session.user.interestCount;
      const postId = req.session.user.postId;
      return res.render("post", {
        post: post,
        comms: comms,
        interestCount: interestCount,
        isAuthor: false,
        prospects: post.prospects,
        postId: postId,
      });
    }
    let postId = req.params.postId;
    let post = await postData.get(postId);
    let prospects = post.prospects;
    let thisUser = req.session.user.userID;
    let comms = await postComment.getAll(postId);
    
    let prospectId;
    h.checkId(postId);

    if (!post) throw "could not find post with that id";

    let interestCount = 0
    let isAuthor;

    if(req.session.user.userID === post.userId){
      isAuthor = true
    }

    if(post.prospects.length === 0 ){
      
      if (req.session.user.userID === post.userId) {
        isAuthor = true;
        return res.render("post", {
          post: post,
          comms: comms,
          interestCount: interestCount,
          isAuthor: isAuthor,
          prospects: post.prospects,
          postId: postId,
        });
      }
      if (!comms) {
      
        return res.render("post", { post: post, interestCount: interestCount});
      } else {
        
      return res.render("post", {
        post: post,
        comms: comms,
        interestCount: interestCount,
        isAuthor: isAuthor,
        prospects: [],
      })
        // return res.render("post", { post: post, comms: comms });
      }
    }
    interestCount = post.prospects.length;

    if (req.session.user.userID === post.userId) {
      isAuthor = true;
      return res.render("post", {
        post: post,
        comms: comms,
        interestCount: interestCount,
        isAuthor: isAuthor,
        prospects: post.prospects,
        postId: postId,
      });
    }

    if (!comms) {
      return res.render("post", {
        post: post,
        interestCount: interestCount,
      }); //interestCount: interestCount
    } else {

      return res.render("post", {
        post: post,
        comms: comms,
        interestCount: interestCount,
        isAuthor: isAuthor,
        prospects: post.prospects,
      });
    }
  } catch (e) {
    return res.status(400).render("error", { error: e , badInput:true});
  }
});

router.route("/:postId/selectProspect").post(async (req, res) => {
  try {
    let postId = req.params.postId;
    let prospectId = xss(req.body.prospects);
    let clientId = req.session.user.userID;
    let status = "not started"; // how unbelievably wicked. Itsss alllll comming togetheaaa!
    let assignedToId = prospectId;
    
    let post = await postData.get(postId);

    if (!post) throw new Error("no post specified");

    let title = post.title;
    let description = post.description;

    const project = await projectData.create(
      title,
      description,
      clientId,       // THIS user
      status,         // not started upon project creation
      assignedToId,   // prospect selected from super sick drop down
      postId
    );

    if (project.created) {

      return res.render("projects", { created: project.created, project: project }); // super duper awesome
    }
  } catch (e) {
    return res.status(400).render("justError", { error: e });
  }
});

router.route("/:postId/comment").post(async (req, res) => {
  try {
    let userId = req.session.user.userID;
    let comm = xss(req.body.postCommentInput);
    let postId = req.params.postId;   // I think this is the issue
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

  } catch (e) {
    return res.status(400).render("justError", { error: e });
  }
});

// needs to change method from get to delete
router.route("/:commentId/deleteComment").get(async (req, res) => {
  try {
    
    let userId = req.session.user.userID;
    let commentId = xss(req.params.commentId);

    h.checkId(userId);    //h.checkValid(userId);
    h.checkId(commentId);
    userId = userId.trim();
    commentId = commentId.trim();
    let postByCommentId = await postData.getByCommentId(commentId);
    if (!postByCommentId) throw "could not find user with that comment";

    let  deletedComment = await postComment.remove(userId, commentId);

    if (!deletedComment) throw "could not delete comment";
    if (deletedComment)
      return res.redirect(`/post/${postByCommentId._id.toString()}`);
  } catch (e) {
    return res.status(400).render("justError", { error: e });
  }
});

router.route("/:postId/delete").delete(async (req, res) => {
  try {
    let userId = req.session.user.userID;
    let postId = xss(req.body.id);

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

    if (deletedPost.deleted) {
      res.status(200).json({
        success: true,
        post_id: deletedPost.postId,
      });
    }

    else throw `could not delete this post : ${postId}`;
  } catch (e) {
    req.session.errorMessage = `Post is not deleted successfully`;
  }
});

export default router;
