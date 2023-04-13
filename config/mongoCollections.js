import { dbConnection } from './mongoConnections.js';

// 1 reference to each collection per app
const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

export const users = getCollectionFn('users');
export const posts = getCollectionFn('posts');
export const reviewRatings = getCollectionFn('reviews');
export const directMessages = getCollectionFn('direct_massages');