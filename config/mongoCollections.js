import { dbConnection } from './mongoConnection.js';

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

export const collection_required = getCollectionFn(''); // placeholder for later on