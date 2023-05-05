import { postData, postComment } from "../data/index.js";
import { Router } from "express";
import {ObjectId} from 'mongodb';
import { messageData } from "../data/index.js";
const router = Router();

  
  router.route("/newPost/createPost").get(async (req, res) => {
    try {
  
      console.log("in create post")
      res.render("create_post");
      
    } catch (e) {
      return res.status(400).render("404", { error: e });
    }
  }); 
  
  router.route("/createPost").post(async (req, res) => {
    try {
        console.log("in /createPost route")
        let title  = req.body.titleInput
        let description = req.body.descriptionInput
        let budget = req.body.budgetInput
        let role = req.body.roleInput
        let categories = req.body.categoriesInput
        let zip = req.body.zipInput;
        let city = req.body.cityInput;
        let state = req.body.stateInput;

      let userId = req.session.user.userID
      console.log("=========================================")
      console.log(req.session.user.userID,"session user ID")
      console.log("=========================================")
      console.log(title, description, budget, role, categories, zip, city, state)
      let newPost = await postData.create(userId, title, description, budget, role, categories, zip, city, state)
    //   console.log("new post")
    //   console.log(newPost)
      res.redirect('/')
    } catch (e) {
      return res.status(400).render("404", { error: e });
    }
  }); 
  


  router.route("/:postId").get(async (req, res) => {
    try {

      console.log("params",req.params,"body",req.body)
      let post = await postData.get(req.params.postId)
    //   console.log(post)
      let comms = await postComment.getAll(req.params.postId)
    //   console.log(comms)
    //   console.log(post,"=========")
    //   console.log(comms,"=========")
    //   console.log("params",req.params,"body",req.body)
      if(!comms){
        return res.render('post',{post:post})
      }else{
        return res.render('post',{post:post, comms:comms})
      }
    } catch (e) {
      return res.status(400).render("404", { error: e });
    }
  })


  

router.route('/:postId/comment').post(async(req, res) => {
    try{
        console.log(req.params)
        console.log(req.body)
        
        let userId = req.session.user.userID
      if(!req.body.postCommentInput) throw 'plese provide input to actually put comment'
      if (!req.params.postId) throw "You must provide an id to search for";
      if (typeof req.params.postId !== "string") throw "Id must be a string";
      if (req.params.postId.trim().length === 0)
        throw "id cannot be an empty string or just spaces";
      req.params.postId = req.params.postId.trim();
      console.log("7623")
      if (!ObjectId.isValid(req.params.postId)) throw "invalid object ID";
      let postId = req.params.postId
      postId = postId.trim()
      let comm = req.body.postCommentInput
      console.log("ycwdtgs")
      let comment = await postComment.create(userId, postId, comm)
        
      // return res.redirect('/:postId')
      return res.render('home', {comment:comment})
    }catch(e){
      return res.status(400).render('404', { error : e })
    }
  })
  
 
  
   // needs to change method from get to delete
   router.route("/:commentId/deleteComment").get(async (req, res) => {
    try {
      if(!req.params.commentId) throw 'could not find comment Id'
      if (typeof req.params.commentId !== "string") throw "Id must be a string";
      if (req.params.commentId.trim().length === 0)
        throw "id cannot be an empty string or just spaces";
      req.params.commentId = req.params.commentId.trim();
      if (!ObjectId.isValid(req.params.commentId)) throw "invalid object ID";
      let userId = req.session.user.userID
      let commentId = req.params.commentId
      commentId = commentId.trim()
  
      let deletedComment = await postComment.remove(userId, commentId)
      if(deletedComment) return res.send(`Comment with ${commentId} has been deleted successfully!`)
      res.json(req.params);
    } catch (e) {
      return res.status(400).render("404", { error: e });
    }
  }); 

  export default router;