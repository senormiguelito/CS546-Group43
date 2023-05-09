import { ObjectId } from "mongodb";
import { posts, user } from "../config/mongoCollections.js";
import { postData, userData } from "./index.js";
import * as h from "../helpers.js";
const postsCollection = await posts();
const userCollection = await user();

export const create = async (userId, postId, comment) => {

  h.checkValid(userId);
  h.checkId(postId);
  h.checkComment(comment);

  userId = userId.trim();
  comment = comment.trim();
  postId = postId.trim();

  if (!comment) throw 'Please enter a comment!';
  if (comment.length === 0) throw 'please enter non-empty comment!';

  let post = await postData.get(postId);
  if (!post) throw "we don't have post with that Id";
  // const postsCollection = await posts();
    
  let user = await userData.getUser(userId);
  if (!user) throw 'we can not find user for that post';


  const newComment = {
    _id: new ObjectId(),
    userId: userId,
    userFirstName: user.firstName,
    userLastName: user.lastName,
    comment: comment
  };
  
  const newPost = await postsCollection.updateOne({ _id: new ObjectId(postId) }, { $push: { comments: newComment } });
  if (newPost.modifiedCount === 0) throw "no comments added";

  return comment;
};

export const getAll = async (postId) => {

  h.checkId(postId);

  let commentList = [];
  let post = undefined;

  post = await postData.get(postId);
  if (!post) throw ("Comment on this postId does not exist in the database");

  if (post.comments) {
    post.comments.forEach(comment => {
      comment._id = comment._id.toString();
      commentList.push(comment);
    });
  }
  
  return commentList;
};

export const getUserByCommentId = async (commentId) => {
  
  h.checkId(commentId);
  //  const userCollection = await user();

  const user = await userCollection.findOne({ 'comment._id': ObjectId(commentId), });       // do we need 'new' here? What's the comment for?
    // I don't think this is going to find a thing

  if (!user) throw new Error("Comment was not found attached to any user in the database");
  
  return user;
};

export const remove = async (userId, commentId) => {
  
  h.checkId(userId);
  h.checkId(commentId);

  let postsCollection = await posts();
  let postList = await postData.getAll();

  if (!postList) throw 'there are no posts!';
  
  
  let post = await postsCollection.findOne({ "comments._id": new ObjectId(commentId) });
  if (!post) throw 'could not find post with that Id';

  let findComment = undefined;
  
  if (Array.isArray(post.comments)) {
    post.comments.forEach(element => {
  
      if (element._id.toString() === commentId) {
        findComment = element;
      }
    });
  }

    let finalPost = undefined;
    if (findComment.userId && post.userId) {
      if (findComment.userId === userId || userId === post.userId.toString()) {
        finalPost = await postsCollection.updateOne(
          { "comments._id": new ObjectId(commentId) },
          { $pull: { comments: { _id: new ObjectId(commentId) } } }
        );
      }
    }
    if (finalPost) {
      if (finalPost.modifiedCount !== 0) {
        return true;
      } else{
        throw 'Could not delete comment';
      }
    } else {
      throw 'Could not delete comment';
    }
  
};
