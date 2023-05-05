import { ObjectId } from "mongodb";
import { posts } from "../config/mongoCollections.js";
import { postData, userData } from "./index.js";
import * as h from "../helpers.js";


const create = async (userId, postId, comment) => {

    h.checkValid(userId)
    h.checkId(postId)

    if(!comment) throw 'please enter comment!'
    if(comment.trim().length === 0) throw 'please enter non-empty comment!'
    userId = userId.trim()
    comment = comment.trim()
    postId = postId.trim()

    let post = await postData.get(postId)
    if(!post) throw "we don't have post with that Id"
    const postsCollection = await posts()
    
    let user = await userData.getUser(userId)
    if(!user) throw 'we can not find user for that post'


    const newComment = {
        _id: new ObjectId(),
        userId:userId,
        userFirstName:user.firstName,
        userLastName:user.lastName,
        comment:comment
    }
  
    const newPost = await postsCollection.updateOne({_id: new ObjectId(postId)} , {$push :{comments:newComment}})
    if (newPost.modifiedCount === 0) throw "no comments added"
    // console.log(newPost,"new comment")
    return comment
}

const getAll = async (postId) => {

    h.checkId(postId)
  
    let commentList = []
    
    let post = undefined
    try{
      post = await postData.get(postId)
    }catch(e){
      throw "band doesn't exist with that bandId"
    }
    if(post.comments){
      post.comments.forEach(element => {
        element._id = element._id.toString()
        commentList.push(element)
      });
    }
    
    return commentList;
  };

  const remove = async (userId, commentId) => {

    h.checkValid(userId)
    h.checkId(commentId)
  
    let postsCollection = await posts()
    let postList = await postData.getAll()
  
    if(!postList) throw 'there are no posts!'
    
    
    let post = await postsCollection.findOne({ "comments._id" : new ObjectId(commentId)})
    if(!post) throw 'could not find post with that Id'
    let findComment = undefined
    if(Array.isArray(post.comments)){
      post.comments.forEach(element => {
    
        if(element._id.toString() === commentId){
          findComment = element
        }
      });
    }
    try{
      let finalPost = undefined
      if(findComment.userId && post.userId){
        if(findComment.userId === userId || userId === post.userId.toString()){
          finalPost = await postsCollection.updateOne(
            { "comments._id": new ObjectId(commentId) },
            { $pull: { comments: { _id: new ObjectId(commentId) } } }
          );
        }
      }
      if(finalPost){
        if(finalPost.modifiedCount !== 0) {
          return true
        }else{
          throw 'could not delete comment'
        }
      }
      else{
        throw 'could not delete comment'
      }
    }catch(e){
      throw e
    }
    
    
  };


export {create,getAll,remove}