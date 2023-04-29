import { dbConnection } from "./mongoConnections.js";

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

export const user = getCollectionFn("users");
export const posts = getCollectionFn("posts");
export const reviewRatings = getCollectionFn("reviews");
export const directMessages = getCollectionFn("direct_messages");
