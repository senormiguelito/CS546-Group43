import { postData, postComment } from "../data/index.js";
import { Router } from "express";
import { ObjectId } from "mongodb";
import * as h from "../helpers.js";
import { messageData } from "../data/index.js";
import xss from "xss";
const router = Router();


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
    
    res.render("myPost", { title: "Here Are All Your Posts!", posts: myPosts });
  } catch (e) {
    return res.status(400).render("404", { error: e });
  }
});

router.route("/newPost/createPost").get(async (req, res) => {
  try {
    console.log("in create post");
    res.render("create_post");
  } catch (e) {
    return res.status(400).render("404", { error: e });
  }
});

router.route("/createPost").post(async (req, res) => {
  try {
    console.log("in /createPost route");
    let title = xss(req.body.titleInput);
    let description = xss(req.body.descriptionInput);
    let budget = xss(req.body.budgetInput);
    let role = xss(req.body.roleInput);
    let categories = xss(req.body.categoriesInput);
    let zip = xss(req.body.zipInput);
    let city = xss(req.body.cityInput);
    let state = xss(req.body.stateInput);
    let userId = req.session.user.userID;

    h.checkTitle(title);
    h.checkDescription(description);
    h.checkbudget(budget);
    h.checkrole(role);
    h.checkzipcode(zip);
    h.checkcity(city);
    h.checkstate(state);
    h.checkId(userId);
    // console.log(title, description, budget, role, categories, zip, city, state)
    let newPost = await postData.create(
      userId,
      title,
      description,
      budget,
      role,
      categories,
      zip,
      city,
      state
    );

    if (newPost.insertedPost) {
      res.redirect("/");
    } else {
      throw "could not create new post";
    } 
      // res.redirect('/')
    } catch (e) {
      return res.status(400).render("404", { error: e });
    }
  }); 
  

  router.route('/filter').post(async (req, res) =>{
    console.log(req.params,req.body)
    let role = xss(req.body.filter);
    console.log("in filter route")
    if(role === 'all'){
      let posts = await postData.getAll()
      return res.render('home',{posts:posts})
    }
    else{
      let posts = await postData.getByRole(role) 
      return res.render("home", { posts: posts });
    }
    
  })

  router.route('/:postId/interested').post(async (req, res) =>{
    console.log(req.params,req.body)
    console.log(req.session)
    let role = req.body.filter
    let postId = req.params.postId
    console.log("in interested route")
    //NOTE to Mikey: you can now create a data function to add this userId or any info. you want to prospect and call that function from here
    //

    //it is redirecting back to same page so you might feel weather or not something happened
    return res.redirect(`/post/${postId}`)
  })


router.route("/:postId").get(async (req, res) => {
  try {
    let postId = req.params.postId;
    let post = await postData.get(postId);

    h.checkId(postId);
    if (!post) throw "could not find post with that id";
    let comms = await postComment.getAll(postId);

    if (!comms) {
      return res.render("post", { post: post });
    } else {
      return res.render("post", { post: post, comms: comms });
    }
  } catch (e) {
    return res.status(400).render("404", { error: e });
  }
});

router.route("/:postId/comment").post(async (req, res) => {
  try {
    let userId = req.session.user.userID;
    let comm = req.body.postCommentInput;
    let postId = req.params.postId;
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
    let commentId = req.params.commentId;

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

export default router;
