import { users } from "../config/mongoCollections.js";
import {ObjectId} from 'mongodb';

export const create = async (
  firstName,
  lastName,
  username,
  emailAddress,
  password,
  phoneNumber,
  role,
  location_city,
  location_state,
  location_zip_code
  // categories,     // initialize empty []
  // bio,            // initialize ""
  // reviews,        // initialize empty []
  // projects,       // initialize empty []
  // joiningDate     // add automatically?
) => {
  
  if (!firstName || !lastName || !username || !emailAddress || !password || !phoneNumber || !role || !location_city || !location_state || !location_zip_code) {
    // || !categories || !bio || !reviews || !projects --> leaving out for now so new user will default initialize these to empty
    throw new Error("every field must be provided");
  }
  if (typeof firstName !== "string") throw new Error("first name must be of type string");
  if (typeof lastName !== "string") throw new Error("last name must be of type string");
  if (typeof username !== "string") throw new Error("username must be of type string");
  if (firstName.trim() === "" || firstName.trim().length <= 2 || firstName.trim().length > 25) throw new Error("First name field is invalid");
  if (lastName.trim() === "" || lastName.trim().length <= 2 || lastName.trim().length > 25) throw new Error("Last name field is invalid");
  if (username.trim() === "") throw new Error("username must not be an empty field");
  if (username.trim().length <= 2 || username.trim().length > 20) throw new error("username must be between 3 and 20 characters"); // reddit's username rules
  
  firstName = firstName.trim();
  lastName = lastName.trim();
  username = username.trim();
  
  for (let i in firstName) {
    if (typeof firstName[i] === 'number') throw new Error("First name should not contain any numbers");
  }
  for (let i in lastName) {
    if (typeof lastName[i] === 'number') throw new Error("First name should not contain any numbers");
  }
  for (let i in username) {
    if (typeof username[i] === ' ') throw new Error("Username should not contain any spaces");
  }
  username = username.toLowerCase();          // must be case insensitive 

  if (typeof emailAddress !== "string") throw new Error("Email must be of type string");
  emailAddress = emailAddress.trim();
  if (emailAddress === "") throw new Error("You must supply an email address");
  const emailValidRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailAddress.test(emailValidRegex)) throw new Error("Invalid email address");
  emailAddress = emailAddress.toLowerCase();  // must be case insensitive

  if (typeof password !== "string") throw new Error("Password must be a valid string");
  if (password.trim() === "" || password.trim().length < 8) throw new Error("Password can not be an empty field");
  if (password.includes(" ")) throw new Error("Password can not contain any spaces");
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!password.test(passwordRegex)) throw new Error("Password must contain an uppercase, a number and a special character");

  const hashLen = 16;
  const hashPassword = await bcrypt.hash(password, hashLen);

  // phone number:
  // NEED TO MAKE SURE PHONE NUMBER IS ENTERED AS DESIRED: NO PARENTHESIS OR '.' --> CREATE CSS DESIGN TO SPECIFY FOR USER
  const phoneNumberRegEx = /^\(?([0-9]{3})\)?[- ]?([0-9]{3})[- ]?([0-9]{4})$/;
  phoneNumber = phoneNumber.trim();
  if (!phoneNumber.value.test(phoneNumberRegEx)) throw new Error("Please enter your phone number in the proper displayed format");

  // role checking, for now
  if (typeof role !== "string") throw new Error("role must be of type string");
  role = role.trim();
  if (role !== "provider" || role !== "seeker") throw new Error("Role must either be provider or seeker");  // similar to lab 10, this will be a drop down
  
  // location_city:
  if (typeof location_city !== 'string') throw new Error("Location: city must be of type string");
  if (typeof location_state !== 'string') throw new Error("Location: state must be of type string");
  if (typeof location_zip_code !== 'string') throw new Error("Location: zip code is of an improper format");

  location_city = location_city.trim();
  if (location_city === "") throw new Error("Location: city can not be an empty field");
  // Fun fact: there are US cities with a length of 1 character, so we don't need to test for min length!
  for (let i in location_city) {
    if (typeof location_city[i] === 'number') throw new Error("Location: city can not contain numbers");
  }
  
  // location state:
  location_state = location_state.trim();
  if (location_state.length !== 2) throw new Error("State must be exactly 2 letters");  // should we make a drop down? 
  for (let i in location_state) {
    if (typeof location_state[i] === 'number') throw new Error("State can not contain a number as input");
  }

  // location zip:
  location_zip_code = location_zip_code.trim();
  if (location_zip_code === "") throw new Error("Location: zip code can not be an empty field");
  if (location_zip_code.length !== 5 || location_zip_code.length !== 9) throw new Error("Location: invalid zip code");

  // Again, here we can and should do CSS styling to preview desired input for user
  const zipRegEx = /^[0-9]{5}(?:-[0-9]{4})?$/;
  let zipTest = zipRegEx.test(location_zip_code);
  if (!zipTest) throw new Error("Location: invalid zip code input");


  
  const userInsert ={
    firstName: firstName,
    lastName: lastName,
    username: username,
    emailAddress: emailAddress,
    password: hashPassword,
    role: role,
    phoneNumber: phoneNumber,
    location_city: location_city,
    location_state: location_state,
    location_zip_code: location_zip_code,
    categories: [],
    bio: "",  // create as a user feature, but not upon profile creation
    reviews: [],
    projects:[]
    // joiningDate:joiningDate
  }
  
  const userCollection = await users();
  const existingEmail = await userCollection.findOne({ emailAddress: emailAddress });
  if (existingEmail) throw new Error("There is already a user with this email address in our database");
  const existingUsername = await userCollection.findOne({ username: username });
  if (existingUsername) throw new Error("There is already a user with this username in our database");

  const insertIntoDB = await userCollection.insertOne(userInsert);

  if (insertIntoDB.insertedCount === 0) throw new Error("User was not successfully inserted into the database");

  insertIntoDB._id = insertIntoDB.insertedId.toString()
  const newUser = await get(insertIntoDB.insertedId.toString());
  return newUser;

};

export const getUser = async (id) => {
  
    const usersCollection = await users()
    const user = await usersCollection.findOne({_id: new ObjectId(id)});
    if (!user) throw 'No user with that id';
    user._id = user._id.toString()
    return user;
  };
