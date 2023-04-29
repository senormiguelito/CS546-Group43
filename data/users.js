import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import * as h from "../helpers.js";
import { user } from "../config/mongoCollections.js";
import { dbConnection } from "../config/mongoConnections.js";

export const create = async (
  firstName,
  lastName,
  emailAddress,
  phoneNumber,
  password,
  role,
  location_zip_code,
  location_city,
  location_state

  // categories,     // initialize empty []
  // bio,            // initialize ""
  // reviews,        // initialize empty []
  // projects,       // initialize empty []
  // joiningDate     // add automatically?
) => {
  h.checkfirstname(firstName);
  h.checklastname(lastName);
  h.checkemail(emailAddress);
  h.checkpassword(password);
  h.checkrole(role);
  h.checkzip(location_zip_code);
  h.checkcity(location_city);
  h.checkstate(location_state);

  const userCollection = await user();

  const emailExistsuser = await userCollection.findOne({
    emailAddress: emailAddress,
  });

  if (!emailExistsuser) {
    const saltRounds = 16;
    const hashPassword = await bcrypt.hash(password, saltRounds);
    const userInsert = {
      firstName: firstName,
      lastName: lastName,
      // username: username,
      emailAddress: emailAddress,
      password: hashPassword,
      role: role,
      phoneNumber: phoneNumber,
      location_city: location_city,
      location_state: location_state,
      location_zip_code: location_zip_code,
      categories: [],
      bio: "", // create as a user feature, but not upon profile creation
      reviews: [],
      projects: [],
      // joiningDate:joiningDate
    };
    const insertIntoDB = await userCollection.insertOne(userInsert);

    if (insertIntoDB.insertedCount === 0)
      throw new Error("User was not successfully inserted into the database");

    insertIntoDB._id = insertIntoDB.insertedId.toString();
    const newUser = await getUser(insertIntoDB.insertedId.toString());
    return newUser;
  }
  if (emailExistsuser)
    throw new Error(
      "There is already a user with this email address in our database"
    );
};

export const getUser = async (id) => {
  if (!id) throw new Error("getUser: no ID provided");
  if (typeof id !== "string" || id.trim() === "")
    throw new Error("getUser: ID must be of type string and non empty");
  id = id.trim();
  if (!ObjectId.isValid(id)) throw new Error("getUser: invalid object ID");

  const userCollection = await user();
  const user = await userCollection.findOne({ _id: new ObjectId(id) });
  if (!user) throw new Error("getUser: No user with that id");
  user._id = user._id.toString();
  return user;
  // gotta double check what you want on return object
};

export const getAll = async () => {
  // collection of all users as an array
  const userCollection = await user();
  const userArray = await userCollection.find({}).toArray();
  userArray.forEach((element) => {
    element._id = element._id.toString();
  });
  if (userArray.length === 0) {
    return [];
  }
  return userArray;
};

export const remove = async (id) => {
  if (!id) throw new Error("Remove: No ID provided");
  if (typeof id !== "string" || id.trim() === "")
    throw new Error("Remove: ID must be a non-empty string");
  id = id.trim();
  if (!Object.isValid(id)) throw new Error("Remove: invalid Object ID");

  const userCollection = await user();
  const removalInfo = await userCollection.findOneAndDelete({
    _id: new ObjectId(id),
  });

  if (removalInfo.deletedCount === 0)
    throw new Error(`Remove: could not delete user with ID of ${id}`);

  return `${removalInfo.value.name} has been successfully deleted!`;
  // return { _id: removalInfo._id.toString(), "deleted": true };
};

export const update = async (
  id,
  firstName,
  lastName,
  emailAddress,
  password,
  phoneNumber,
  location_city,
  location_state,
  location_zip_code,
  categories,
  bio
) => {
  if (
    !firstName ||
    !lastName ||
    !emailAddress ||
    !password ||
    !phoneNumber ||
    !location_city ||
    !location_state ||
    !location_zip_code ||
    !categories ||
    !bio
  ) {
    throw new Error("every field must be provided");
  }
  if (typeof firstName !== "string")
    throw new Error("first name must be of type string");
  if (typeof lastName !== "string")
    throw new Error("last name must be of type string");
  if (typeof username !== "string")
    throw new Error("username must be of type string");
  if (
    firstName.trim() === "" ||
    firstName.trim().length <= 2 ||
    firstName.trim().length > 25
  )
    throw new Error("First name field is invalid");
  if (
    lastName.trim() === "" ||
    lastName.trim().length <= 2 ||
    lastName.trim().length > 25
  )
    throw new Error("Last name field is invalid");
  if (username.trim() === "")
    throw new Error("username must not be an empty field");
  if (username.trim().length <= 2 || username.trim().length > 20)
    throw new error("username must be between 3 and 20 characters"); // reddit's username rules

  firstName = firstName.trim();
  lastName = lastName.trim();
  username = username.trim();

  for (let i in firstName) {
    if (typeof firstName[i] === "number")
      throw new Error("First name should not contain any numbers");
  }
  for (let i in lastName) {
    if (typeof lastName[i] === "number")
      throw new Error("First name should not contain any numbers");
  }
  // for (let i in username) {
  //   if (typeof username[i] === " ")
  //     throw new Error("Username should not contain any spaces");
  // }
  // username = username.toLowerCase(); // must be case insensitive

  if (typeof emailAddress !== "string")
    throw new Error("Email must be of type string");
  emailAddress = emailAddress.trim();
  if (emailAddress === "") throw new Error("You must supply an email address");
  const emailValidRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailValidRegex.test(emailAddress))
    throw new Error("Invalid email address");
  emailAddress = emailAddress.toLowerCase(); // must be case insensitive

  if (typeof password !== "string")
    throw new Error("Password must be a valid string");
  if (password.trim() === "" || password.trim().length < 8)
    throw new Error("Password can not be an empty field");
  if (password.includes(" "))
    throw new Error("Password can not contain any spaces");
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password))
    throw new Error(
      "Password must contain an uppercase, a number and a special character"
    );

  const hashLen = 16;
  const hashPassword = await bcrypt.hash(password, hashLen);

  // phone number:
  const phoneNumberRegEx = /^\(?([0-9]{3})\)?[- ]?([0-9]{3})[- ]?([0-9]{4})$/;
  phoneNumber = phoneNumber.trim();
  if (!phoneNumberRegEx.value.test(phoneNumber))
    throw new Error(
      "Please enter your phone number in the proper displayed format"
    );

  // role checking, for now
  if (typeof role !== "string") throw new Error("role must be of type string");
  role = role.trim();
  if (role !== "provider" || role !== "seeker")
    throw new Error("Role must either be provider or seeker"); // similar to lab 10, this will be a drop down

  // location_city:
  if (typeof location_city !== "string")
    throw new Error("Location: city must be of type string");
  if (typeof location_state !== "string")
    throw new Error("Location: state must be of type string");
  if (typeof location_zip_code !== "string")
    throw new Error("Location: zip code is of an improper format");

  location_city = location_city.trim();
  if (location_city === "")
    throw new Error("Location: city can not be an empty field");
  // Fun fact: there are US cities with a length of 1 character, so we don't need to test for min length!
  for (let i in location_city) {
    if (typeof location_city[i] === "number")
      throw new Error("Location: city can not contain numbers");
  }

  // location state:
  location_state = location_state.trim();
  if (location_state.length !== 2)
    throw new Error("State must be exactly 2 letters"); // should we make a drop down?
  for (let i in location_state) {
    if (typeof location_state[i] === "number")
      throw new Error("State can not contain a number as input");
  }

  // location zip:
  location_zip_code = location_zip_code.trim();
  if (location_zip_code === "")
    throw new Error("Location: zip code can not be an empty field");
  if (location_zip_code.length !== 5 || location_zip_code.length !== 9)
    throw new Error("Location: invalid zip code");

  // Again, here we can and should do CSS styling to preview desired input for user
  const zipRegEx = /^[0-9]{5}(?:-[0-9]{4})?$/;
  let zipTest = zipRegEx.test(location_zip_code);
  if (!zipTest) throw new Error("Location: invalid zip code input");

  // bio:
  if (typeof bio !== "string")
    throw new Error("Update: bio must be of type string");
  if (bio.length > 5000)
    throw new Error("Update: bio can not exceed 5000 characters");
  if (bio.trim() === "") throw new Error("Update: bio must not be empty");

  // categories
  if (!Array.isArray(categories))
    throw new Error("Update: categories must be an array");
  if (categories.length < 1)
    throw new Error("Update: you must supply at least 1 category");
  for (let i in categories) {
    if (typeof categories[i] !== "string" || categories[i].trim() === "")
      throw new Error("Update: each category must be a non-empty string");
    categories[i] = categories[i].trim();
    for (let j in categories[i]) {
      if (typeof categories[i][j] === "number")
        throw new Error("Update: invalid category response");
    }
  }

  const userCollection = await user();
  const updateUserInfo = {
    // only include in here the stuff that makes sense for the user to update
    firstName: firstName,
    lastName: lastName,
    emailAddress: emailAddress,
    password: hashPassword,
    phoneNumber: phoneNumber,
    location_city: location_city,
    location_state: location_state,
    location_zip_code: location_zip_code,
    categories: categories,
    bio: bio,
  };
  // check if updated email already exists!
  const existingEmail = await userCollection.findOne({
    emailAddress: emailAddress,
  });
  if (existingEmail)
    throw new Error(
      "There is already a user with this email address in our database"
    );

  // refer to lab 6 albums.js for rating updating , and all this stuff too

  const userUpdate = await userCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateUserInfo }
  );

  if (userUpdate.modifiedCount === 1) {
    const updatedTrue = await userCollection.findOne({ _id: new ObjectId(id) });
    return updatedTrue;
  } else {
    throw new Error("Update: user was not upated");
  }
};

// if (
//   !firstName ||
//   !lastName ||
//   !emailAddress ||
//   !password ||
//   !phoneNumber ||
//   !role ||
//   !location_city ||
//   !location_state ||
//   !location_zip_code
// ) {
//   // !username || !location_city || !location_state || !location_zip_code|| !categories || !bio || !reviews || !projects --> leaving out for now so new user will default initialize these to empty
//   throw new Error("every field must be provided");
// }
// if (typeof firstName !== "string")
//   throw new Error("first name must be of type string");
// if (typeof lastName !== "string")
//   throw new Error("last name must be of type string");
// if (typeof username !== "string")
//   throw new Error("username must be of type string");
// if (
//   firstName.trim() === "" ||
//   firstName.trim().length <= 2 ||
//   firstName.trim().length > 25
// )
//   throw new Error("First name field is invalid");
// if (
//   lastName.trim() === "" ||
//   lastName.trim().length <= 2 ||
//   lastName.trim().length > 25
// )
//   throw new Error("Last name field is invalid");
// if (username.trim() === "")
//   throw new Error("username must not be an empty field");
// if (username.trim().length <= 2 || username.trim().length > 20)
//   throw new Error("username must be between 3 and 20 characters"); // reddit's username rules

// firstName = firstName.trim();
// lastName = lastName.trim();
// username = username.trim();

// for (let i in firstName) {
//   if (typeof firstName[i] === "number")
//     throw new Error("First name should not contain any numbers");
// }
// for (let i in lastName) {
//   if (typeof lastName[i] === "number")
//     throw new Error("First name should not contain any numbers");
// }
// // for (let i in username) {
// //   if (typeof username[i] === " ")
// //     throw new Error("Username should not contain any spaces");
// // }
// // username = username.toLowerCase(); // must be case insensitive

// if (typeof emailAddress !== "string")
//   throw new Error("Email must be of type string");
// emailAddress = emailAddress.trim();
// if (emailAddress === "") throw new Error("You must supply an email address");
// const emailValidRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// if (!emailValidRegex.test(emailAddress))
//   throw new Error("Invalid email address");
// emailAddress = emailAddress.toLowerCase(); // must be case insensitive

// if (typeof password !== "string")
//   throw new Error("Password must be a valid string");
// if (password.trim() === "" || password.trim().length < 8)
//   throw new Error("Password can not be an empty field");
// if (password.includes(" "))
//   throw new Error("Password can not contain any spaces");
// const passwordRegex =
//   /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
// if (!passwordRegex.test(password))
//   throw new Error(
//     "Password must contain an uppercase, a number and a special character"
//   );

// const hashLen = 16;
// const hashPassword = await bcrypt.hash(password, hashLen);

// // phone number:
// // NEED TO MAKE SURE PHONE NUMBER IS ENTERED AS DESIRED: NO PARENTHESIS OR '.' --> CREATE CSS DESIGN TO SPECIFY FOR USER
// const phoneNumberRegEx = /^\(?([0-9]{3})\)?[- ]?([0-9]{3})[- ]?([0-9]{4})$/;
// phoneNumber = phoneNumber.trim();
// if (!phoneNumberRegEx.value.test(phoneNumber))
//   throw new Error(
//     "Please enter your phone number in the proper displayed format"
//   );

// // role checking, for now
// if (typeof role !== "string") throw new Error("role must be of type string");
// role = role.trim();
// if (role !== "provider" || role !== "seeker")
//   throw new Error("Role must either be provider or seeker"); // similar to lab 10, this will be a drop down

// // location_city:
// if (typeof location_city !== "string")
//   throw new Error("Location: city must be of type string");
// if (typeof location_state !== "string")
//   throw new Error("Location: state must be of type string");
// if (typeof location_zip_code !== "string")
//   throw new Error("Location: zip code is of an improper format");

// location_city = location_city.trim();
// if (location_city === "")
//   throw new Error("Location: city can not be an empty field");
// // Fun fact: there are US cities with a length of 1 character, so we don't need to test for min length!
// for (let i in location_city) {
//   if (typeof location_city[i] === "number")
//     throw new Error("Location: city can not contain numbers");
// }

// // location state:
// location_state = location_state.trim();
// if (location_state.length !== 2)
//   throw new Error("State must be exactly 2 letters"); // should we make a drop down?
// for (let i in location_state) {
//   if (typeof location_state[i] === "number")
//     throw new Error("State can not contain a number as input");
// }

// // location zip:
// location_zip_code = location_zip_code.trim();
// if (location_zip_code === "")
//   throw new Error("Location: zip code can not be an empty field");
// if (location_zip_code.length !== 5 || location_zip_code.length !== 9)
//   throw new Error("Location: invalid zip code");

// // Again, here we can and should do CSS styling to preview desired input for user
// const zipRegEx = /^[0-9]{5}(?:-[0-9]{4})?$/;
// let zipTest = zipRegEx.test(location_zip_code);
// if (!zipTest) throw new Error("Location: invalid zip code input");
