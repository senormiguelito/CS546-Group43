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
    if(!posts) throw new Error("could not find any posts!") 
    // console.log("in create post");
    res.render("post", { posts: posts });
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
    res.render("create_post");
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

router.route("/:postId/interested").post(async (req, res) => {
  let role = xss(req.body.filter);
  let postId = req.params.postId;

  //  console.log("in interested route");
  try {
    let post = await postData.get(postId);

    if (!post) throw new Error("Post was not found");
    let prospectpush = {};

    prospectpush["userId"] = req.session.user.userID;
    prospectpush["firstName"] = req.session.user.userSessionData.firstName;
    prospectpush["lastName"] = req.session.user.userSessionData.lastName;
    prospectpush["role"] = req.session.user.userSessionData.role;
    prospectpush["email"] = req.session.user.userSessionData.emailAddress;
    prospectpush["userCity"] = req.session.user.userSessionData.location_city;

    console.log(prospectpush);
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
      post.comments
    );
    

    //it is redirecting back to same page so you might feel weather or not something happened
    if (updatedPost) {
      let comms = await postComment.getAll(postId);
      // okay so need a way to show number of people interested
      let interestCount = updatedPost.prospects.length;

      // this is where we will use AJAX form submission --> update the page without refreshing/reloading to show updated interest count

      return res.render("post", {
        post: post,
        comms: comms,
        interestCount: interestCount,
      });
      // return res.redirect(`/post/${postId}`);
    }
  } catch (e) {
    res.status(400).render("error", { error: e });
  }
});

router.route("/filter").post(async (req, res) => {
  // console.log(req.params, req.body);
  let role = xss(req.body.filter); // xss?!
  // console.log("in filter route");
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
    let postId = req.params.postId;
    let post = await postData.get(postId);
    let prospectId;
    h.checkId(postId);
   
    if (!post) throw "could not find post with that id";

    let comms = await postComment.getAll(postId);
  
    let interestCount = 0
    let isAuthor;


    if(req.session.user.userID === post.userId){
      isAuthor = true
    }
    // console.log(isAuthor)
    if(post.prospects.length === 0 ){
      
      if (req.session.user.userID === post.userId) {
        isAuthor = true;
        console.log("sess.ion.user is the user who posted");
        console.log("post prospects:");
        // console.log(post.prospects);
        return res.render("post", {
          post: post,
          comms: comms,
          interestCount: interestCount,
          isAuthor: isAuthor,
          prospects: [],
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
        return res.render("post", { post: post, comms: comms });
      }
    }
    interestCount = post.prospects.length;

    // THIS IS HOW THE USER WHO POSTED IT WILL CREATE THE PROJECT SUBDOC!
    // IF THEY POSTED THEY CAN VIEW THIS. THEY SELECT THE USER THEY DESIRE
    // THEN HTML SUBMIT WILL CALL DATA/PROJECTS.JS 'CREATE' FUNCTION
    // THE ROUTE BELOW WILL WORK DIVINELY AND AFTER USER SUCCESSFULLY ENTERS THE
    // PARAMETERS, THEY WILL LINK TO THEIR PROJECTS PAGE WHICH WILL HAVE THIS NEW PROJECT
    // LGTM!
    console.log("hjds");

    console.log("hjds");
    if (req.session.user.userID === post.userId) {
      isAuthor = true;
      console.log("sess.ion.user is the user who posted");
      console.log("post prospects:");
      console.log(post.prospects);
      return res.render("post", {
        post: post,
        comms: comms,
        interestCount: interestCount,
        isAuthor: isAuthor,
        prospects: post.prospects,
        postId: postId,
      });
    }
    console.log("bsdkjc");
    if (!comms) {
      console.log("bsdkjc");
      return res.render("post", {
        post: post,
        interestCount: interestCount,
      }); //interestCount: interestCount
    } else {
      console.log("bsdkjc");
      return res.render("post", {
        post: post,
        comms: comms,
        interestCount: interestCount,
        isAuthor: isAuthor,
        prospects: post.prospects,
      });
    }
  } catch (e) {
    console.log("jhdavfk6")
    return res.status(400).render("justError", { error: e });
  }
});

router.route("/:postId/selectProspect").post(async (req, res) => {
  try {
    console.log("254 in selectProspect");
    let postId = req.params.postId;
    let prospectId = xss(req.body.prospects);
    // console.log("req.body: ", req.body, "req.params:", req.params)
    //let title = xss(req.body.title);
    //let description = xss(req.body.description);
    let clientId = req.session.user.userID;
    let status = "not started"; // how unbelievably wicked. Itsss alllll comming togetheaaa!
    let assignedToId = prospectId;

    let post = await postData.get(postId);
    if (!post) throw new Error("no post specified");
    let title = post.title;
    let description = post.description;

    console.log("264");
    // lets create the damn thing
    console.log(title, description, clientId, status, assignedToId);

    const project = await projectData.create(
      title,
      description,
      clientId, // THIS user
      status, // not started upon project creation
      assignedToId // prospect selected from super sick drop down
    );

    console.log("create went well");

    console.log("project create called"); // --------> gotta delete posting, or hide it from the page - (now other users shouldn't be able to access it)
    if (project.created) {
      // routes/user.js line 142
      return res.render("projects", { created: created, project: project }); // super duper awesome
    }
  } catch (e) {
    return res.status(400).render("justError", { error: e });
  }
});

router.route("/:postId/comment").post(async (req, res) => {
  try {
    let userId = req.session.user.userID;
    let comm = xss(req.body.postCommentInput);
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
    return res.status(400).render("justError", { error: e });
  }
});

// needs to change method from get to delete
router.route("/:commentId/deleteComment").get(async (req, res) => {
  try {
    let userId = req.session.user.userID;
    let commentId = xss(req.params.commentId);

    console.log("in here")
    h.checkValid(userId);
    h.checkId(commentId);
    userId = userId.trim();
    commentId = commentId.trim();
    let postByCommentId = await postData.getByCommentId(commentId);
    if (!postByCommentId) throw "could not find user with that comment";

    let  deletedComment = await postComment.remove(userId, commentId);
    // console.log(deletedComment,"delcom")
    if (!deletedComment) throw "could not delete comment";
    if (deletedComment)
      return res.redirect(`/post/${postByCommentId._id.toString()}`);
    // res.redirect(`/post/${postByCommentId._id.toString()}`)
  } catch (e) {
    return res.status(400).render("justError", { error: e });
  }
});

router.route("/:postId/delete").post(async (req, res) => {
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
      console.log("successfully deleteted");
      // req.session.successMessage = `Post(${deletedPost.postId}) deleted successfully`;
      res.status(200).json({
        success: true,
        post_id: deletedPost.postId,
      });
    }
    // return res.redirect(`/post/myposts`);
    else throw `could not delete this post : ${postId}`;
  } catch (e) {
    req.session.errorMessage = `Post is not deleted successfully`;
    // return res.redirect(`/post/myposts`);
  }
});

export default router;
