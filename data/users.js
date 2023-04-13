import { users } from "../config/mongoCollections.js";
import {ObjectId} from 'mongodb';

const create = async (
    username,
    firstName,
    LastName,
    email,
    password,
    role,
    phoneNumber,
    location,
    categories,
    bio,
    reviews,
    projects,
    joiningDate
  ) => {
  
  
    username = username.trim()
    firstName = firstName.trim()
    LastName = LastName.trim()
    email = email.trim()
    role = role.trim()
    phoneNumber = phoneNumber.trim()
    location = location.trim()
    bio = bio.trim()
  
    const usersInfo ={
        username:username,
        firstName:firstName,
        LastName:LastName,
        email:email,
        password:password,
        role:role,
        phoneNumber:phoneNumber,
        location:location,
        categories:categories,
        bio:bio,
        reviews:reviews,
        projects:projects,
        joiningDate:joiningDate
    }
  
    const usersCollection = await users()
    const insertInfo = await usersCollection.insertOne(usersInfo)
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw 'Could not add user';
    insertInfo._id = insertInfo.insertedId.toString()
    const newUser = await get(insertInfo.insertedId.toString());
    return newUser;
  };

  const get = async (id) => {
  
    const usersCollection = await users()
    const user = await usersCollection.findOne({_id: new ObjectId(id)});
    if (!user) throw 'No user with that id';
    user._id = user._id.toString()
    return user;
  };

  export {create,get}