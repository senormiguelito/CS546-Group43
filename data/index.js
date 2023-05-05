import * as postDataFunctions from './posts.js';
import * as reviewRatingsDataFunctions from './reviewRatings.js';
import * as usersFunctions from './users.js';
import * as directMessages from './directMessages.js';
import * as postCommentFunctions from './postComment.js';
import * as projectFunctions from './projects.js';

export const postData = postDataFunctions;
export const postComment = postCommentFunctions;
export const reviewData = reviewRatingsDataFunctions;
export const userData = usersFunctions;
export const messageData = directMessages;
export const projectData = projectFunctions;