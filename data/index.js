import * as postDataFunctions from './posts.js';
import * as reviewRatingsDataFunctions from './reviewRatings.js';
import * as usersFunctions from './users.js';
import * as directMessages from './directMessages.js';

export const postData = postDataFunctions;
export const reviewData = reviewRatingsDataFunctions;
export const userData = usersFunctions;
export const messageData = directMessages;

/* 
I suppose this makes it easier to refer to the functions in routes:

  const reviews = await reviewData.get(revieweeId);
*/