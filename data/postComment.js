import { ObjectId } from "mongodb";
import { posts } from "../config/mongoCollections.js";
import { postData, userData } from "./index.js";

const create = async (postId, comment) => {
    console.log("in create comment")
    if(!comment || !postId) throw 'post Id and comment must be provided!'
    if(comment.trim().length === 0 || postId.trim().length === 0) throw 'can not have an empty post id or comment'
    comment = comment.trim()
    postId = postId.trim()

    console.log(postId, comment)
    let post = await postData.get(postId)
    if(!post) throw "we don't have post with that Id"
    const postsCollection = await posts()

    let user = await userData.getUser(post.seekerId)
    if(!user) throw 'we can not find user for that post'


    const newComment = {
        _id: new ObjectId(),
        userId:user._id,
        userEmailAddress:user.emailAddress,
        comment:comment
    }
    // console.log(post,"jbdjks")
    const newPost = await postsCollection.updateOne({_id: new ObjectId(postId)} , {$push :{comments:newComment}})
    if (newPost.modifiedCount === 0) throw "no comments added"

    return comment
}

const getAll = async (postId) => {

    // If the postId is not provided, the method should throw.
    if (!postId) throw 'You must provide an id to search for';
    
    // If the postId  provided is not a string, or is an empty string, the method should throw.
    if(typeof postId !== 'string') throw 'postId must be string'
    if(postId.trim().length === 0) throw 'postId can not be an empty string'
  
    // If the postId  provided is not a valid ObjectId, the method should throw
    if(!ObjectId.isValid(postId)) throw 'Invalid ObjectId'
  
    let commentList = []
    
    let post = undefined
    // If the band doesn't exist with that bandId, the method should throw
    try{
      post = await postData.get(postId)
    }catch(e){
      throw "band doesn't exist with that bandId"
    }
    console.log()
    if(post.comments){
      post.comments.forEach(element => {
        element._id = element._id.toString()
        commentList.push(element)
      });
    }
    
    return commentList;
  };

  const remove = async (commentId) => {
    // If the commentId is not provided, the method should throw.
    console.log("In remove!!!!!")
    console.log(commentId)
    if(!commentId) throw 'commentId is not provided'
  
    // If the commentId provided is not a string, or is an empty string, the method should throw.
    if(typeof commentId !=='string') throw 'commentId provided is not a string'
    if(commentId.length === 0) throw 'empty string!'
  
    // If the commentId provided is not a valid ObjectId, the method should throw
    if(!ObjectId.isValid(commentId)) throw 'invalid commentId'
  
    let postsCollection = await posts()
    let postList = await postData.getAll()
  
    if(!postList) throw 'there are no posts!'
    
    
    // console.log(albumId,"lkjhgf")
    let post = await postsCollection.findOne({ "comments._id" : new ObjectId(commentId)})
  
    try{
      let finalPost = await postsCollection.updateOne(
        { "comments._id": new ObjectId(commentId) },
        { $pull: { comments: { _id: new ObjectId(commentId) } } }
      );
      if(finalPost.modifiedCount !== 0) {
        return true
      }else{
        throw 'could not delete comment'
      }
    }catch(e){
      throw e
    }
    
    
  };

export {create,getAll,remove}