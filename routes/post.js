import { postData, postComment } from "../data/index.js";
import { Router } from "express";
import {ObjectId} from 'mongodb';
import * as h from "../helpers.js";
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
        if(!userId) throw 'You need to login to access all the functions!'

        //this is different than helper function. don't delete it.
        if (!categories) throw new Error("categories not provided");
        
        if (!Array.isArray(categories))
          throw new Error("Update: categories must be an array");
          
        const filteredCategories = categories.filter(element => {
          return element !== '';
        });
        
        if (filteredCategories.length < 1)
          throw new Error("Update: you must supply at least 1 category");
        for (let i in filteredCategories) {
          if (typeof filteredCategories[i] !== "string")
            throw new Error("Update: each category must be a string");
          filteredCategories[i] = filteredCategories[i].trim();
          for (let j in filteredCategories[i]) {
            if (typeof filteredCategories[i][j] === "number")
            throw new Error("Update: invalid category response");
          }
        }
        console.log(filteredCategories)
        h.checkTitle(title)
        h.checkDescription(description)
        h.checkbudget(budget)
        h.checkrole(role)
        h.checkzipcode(zip)
        h.checkcity(city)
        h.checkstate(state)
        h.checkId(userId)
      // console.log(title, description, budget, role, categories, zip, city, state)
      let newPost = await postData.create(userId, title, description, budget, role, filteredCategories, zip, city, state)
      if(!newPost) throw 'could not create new post'
    //   console.log("new post")
    //   console.log(newPost)
      res.redirect('/')
    } catch (e) {
      return res.status(400).render("404", { error: e });
    }
  }); 
  

  // router.route('/filter').get(async (req, res) =>{

  // })


  router.route("/:postId").get(async (req, res) => {
    try {
      let postId = req.params.postId
      let post = await postData.get(postId)
      
      h.checkId(postId)
      if(!post) throw 'could not find post with that id'
      let comms = await postComment.getAll(postId)
    
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

        let userId = req.session.user.userID
        let comm = req.body.postCommentInput
        let postId = req.params.postId
        h.checkId(userId)
        h.checkId(postId)
        
       
        if(!comm) throw 'please enter comment!'
        if(typeof comm !== 'string') throw 'comment should be of string value'
        if(comm.trim().length === 0) throw 'please enter non-empty comment!'
        
        postId = postId.trim()
        userId = userId.trim()
        comm = comm.trim()
      
      let comment = await postComment.create(userId, postId, comm)
      if(!comment) throw 'could not add comment'
        
      return res.redirect(`/post/${postId}`)
      // return res.render('home', {comment:comment})
    }catch(e){
      return res.status(400).render('404', { error : e })
    }
  })
  
 
  
   // needs to change method from get to delete
   router.route("/:commentId/deleteComment").get(async (req, res) => {
    try {
      
      let userId = req.session.user.userID
      let commentId = req.params.commentId

      h.checkValid(userId)
      h.checkId(commentId)
      userId = userId.trim()
      commentId = commentId.trim()
      let postByCommentId = await postData.getByCommentId(commentId)
      if(!postByCommentId) throw 'could not find user with that comment'
      let deletedComment = await postComment.remove(userId, commentId)
      if(deletedComment) return res.redirect(`/post/${postByCommentId._id.toString()}`)
      if(!deletedComment) throw 'could not delete comment'
      // res.redirect(`/post/${postByCommentId._id.toString()}`)
      // res.json(req.params);
    } catch (e) {
      return res.status(400).render("404", { error: e });
    }
  }); 

  export default router;