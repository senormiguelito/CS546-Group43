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

  const getMessages = async (id) => {
    if (!id) throw 'Please provide an id ';
    if (typeof id !== 'string' || id.trim().length === 0)
      throw 'Please provide a valid id';
    if (ObjectId.isValid(id) === false) throw 'Please provide a valid id';


    const directMessagesCollection = await directMessages()
    // let directMessage = await directMessagesCollection.find({$or:[{senderId:id},{recipientId:id}]}).toArray()
    let directMessage = await directMessagesCollection.find({$or:[{senderId:id},{recipientId:id}]}).sort({timeStamp: -1}).toArray();

    if(directMessage.length==0) {
      directMessage = []
    }

    // const directMessage = await directMessagesCollection.findOne({_id: new ObjectId(id)});
    // if (!directMessage) throw 'No direct message with that id';
    return directMessage;
  };
  const getAllMessages = async () => {
    // console.log("inside data > posts > getAll");
    const directMessagesCollection = await directMessages();
    let directMessageList = await directMessagesCollection.find({}).toArray();
    if (!directMessageList) throw new Error('Could not get all direct messages');

    directMessageList = directMessageList.map((element) => {
      element._id = element._id.toString();
      return element;
    });
    return directMessageList;
  }
  const sendMessage = async (sender, reciever, message) => {
    const directMessagesCollection = await directMessages();
    if(!sender || !reciever || !message) throw 'You must provide all fields to send a message';
    if(typeof sender !== 'string' || typeof reciever !== 'string' || typeof message !== 'string') throw 'You must provide all fields to send a message';
    if(ObjectId.isValid(sender) === false || ObjectId.isValid(reciever) === false) throw 'You must provide all fields to send a message';
    if(sender === reciever) throw 'You cannot send a message to yourself';
    const d1 = new Date();
    
    const newMessage = {
      senderId: sender,
      recieverId: reciever,
      message: message,
      timeStamp: d1.toISOString()
    };
    const insertInfo = await directMessagesCollection.insertOne(newMessage);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw 'Could not send direct message';
    insertInfo._id = insertInfo.insertedId.toString();
    return insertInfo;
  };



  export {create,getMessages, getAllMessages, sendMessage}