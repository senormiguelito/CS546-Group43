import { directMessages } from "../config/mongoCollections.js";
import {ObjectId} from 'mongodb';
let d1 = new Date()
const create = async (
    senderId,
    recipientId,
    message
     
  ) => {
  
 
    const directMessagesInfo ={
        senderId:senderId,
        recipientId:recipientId,
        message:message,
        timeStamp:d1.toISOString()
    }
  
    const directMessagesCollection = await directMessages()
    const insertInfo = await directMessagesCollection.insertOne(directMessagesInfo)
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw 'Could not add direct message';
    insertInfo._id = insertInfo.insertedId.toString()
    const newDirectMessage = await get(insertInfo.insertedId.toString());
    return newDirectMessage;
  };

  const get = async (id) => {
  
    const directMessagesCollection = await directMessages()
    const directMessage = await directMessagesCollection.findOne({_id: new ObjectId(id)});
    if (!directMessage) throw 'No direct message with that id';
    directMessage._id = directMessage._id.toString()
    return directMessage;
  };

  export {create,get}