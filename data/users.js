import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import * as h from "../helpers.js";
import { user } from "../config/mongoCollections.js";
const userCollection = await user();

export const create = async (
  // getting from the route, which pulls from the form
  firstName,
  lastName,
  date_of_birth,
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
  h.checkDOB(date_of_birth); // for now splitting and parsing as a string, but we will use html <input type="date"> to avoid potential errors & invalid inputs
  h.checkemail(emailAddress);
  h.checkphone(phoneNumber);
  h.checkpassword(password);
  h.checkrole(role);
  h.checkzipcode(location_zip_code);
  h.checkcity(location_city);
  h.checkstate(location_state);

  firstName = firstName.trim();
  lastName = lastName.trim();
  emailAddress = emailAddress.trim().toLowerCase();
  phoneNumber = phoneNumber.trim();
  password = password.trim();
  role = role.trim();
  location_zip_code = location_zip_code.trim();
  location_city = location_city.trim();
  location_state = location_state.trim();

  const emailExists = await userCollection.findOne({
    emailAddress: emailAddress,
  });

  if (emailExists)
    throw new Error(
      "There is already a user with this email address in our database"
    );

  if (!emailExists) {
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

    // const getStringID = await this.get(insertIntoDB.insertedId.toString());
    const newUser = await getUser(insertIntoDB.insertedId.toString());

    return { newUser, insertedUser: true };
  }
};

export const checkUser = async (emailAddress, password) => {
  h.checkemail(emailAddress);
  h.checkpassword(password);
  emailAddress = emailAddress.toLowerCase(); //hey here I realized that we have to lower the case at the data entry time also, for mail.

  const thisUser = await userCollection.findOne({ emailAddress: emailAddress });
  // find a way to get ID, look @ lab 6, add into user obejct. Will be useful for authentication, add to return object
  const userById = await userCollection.findOne({
    _id: new ObjectId(thisUser._id),
  }); // good?
  if (!thisUser)
    throw `No user registered with this email "${emailAddress}", Register now.`; // not error, it's a validation message that user can see at the login page.

  // let bcryptCompare;    // = false?
  const hashedPass = thisUser.password;
  const userId = thisUser._id.toString();
  console.log(userId);

  const bcryptCompare = await bcrypt.compare(password, hashedPass);
  if (bcryptCompare) {
    return {
      // talk with group about what we want to return to get user logged in
      userId: userId,
      firstName: thisUser.firstName,
      lastName: thisUser.lastName,
      emailAddress: thisUser.emailAddress,
      phoneNumber: thisUser.phoneNumber,
      role: thisUser.role,
      location_city: thisUser.location_city,
      location_state: thisUser.location_state,
      location_zip_code: thisUser.location_zip_code,
      authentication: true,
    };
  } else {
    throw `Either the email address or password is invalid`; // It's not error, just telling user this validation fails. So, I removed new Error().
  }
};

export const getUser = async (id) => {
  if (!id) throw new Error("getUser: no ID provided");
  if (typeof id !== "string" || id.trim() === "")
    throw new Error("getUser: ID must be of type string and non empty");
  id = id.trim();
  if (!ObjectId.isValid(id)) throw new Error("getUser: invalid object ID");

  const userData = await userCollection.findOne({ _id: new ObjectId(id) });
  if (!userData) throw new Error("getUser: No userData with that id");
  userData._id = userData._id.toString();
  return userData;
  // gotta double check what you want on return object
};

export const getUsersByRole = async (role) => {
  h.checkrole(role);
  const usersArray = await userCollection.find({ role: role }).toArray();
  usersArray.forEach((user) => {
    user._id = user._id.toString();
  });
  if (!usersArray || usersArray.length === 0)
    throw new Error("No users found with given role");
  // Orrr do we just wanna return an empty array? []
  return usersArray;
};

export const getUsersByCategory = async (category) => {
  h.checkCategories(category);
  const users_byCategory = await userCollection
    .find({ categories: category })
    .toArray();

  const stringIDs = users_byCategory.map((user) => {
    // --> converts each '_id' to a string before returning... good?
    user._id = user._id.toString();
  });

  if (!users_byCategory)
    throw new Error("No users with specified category field found");
  return users_byCategory;
};

export const getUsersByCity = async (location_city) => {
  h.checkcity(location_city);
  const usersByCity = await userCollection
    .find({ location_city: location_city })
    .toArray();

  const stringIDusers_city = usersByCity.map((user) => {
    user._id = user._id.toString();
  }); // can comment out if unnecessary/needed

  if (!usersByCity || usersByCity.length === 0)
    throw new Error("No users in the specified city found");
  return usersByCity;
};

export const getUsersByState = async (location_state) => {
  h.checkstate(location_state);
  const usersByState = await userCollection
    .find({ location_state: location_state })
    .toArray();

  const stringIDusers_state = usersByState.map((user) => {
    user._id = user._id.toString();
  });

  if (!usersByState || usersByState.length === 0)
    throw new Error("No users in this state found");
  return usersByState;
};

export const getUsersByZip = async (location_zip_code) => {
  h.checkzipcode(location_zip_code);
  const usersByZip = await userCollection
    .find({ location_zip_code: location_zip_code })
    .toArray();

  const stringIDusers_zip = usersByZip.map((user) => {
    user._id = user._id.toString();
  });

  if (!usersByZip || usersByZip.length === 0)
    throw new Error("No users in this zip code found");
  return usersByZip;
};

export const getAll = async () => {
  // collection of all users as an array
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
  h.checkfirstname(firstName);
  h.checklastname(lastName);
  h.checkemail(emailAddress);
  h.checkpassword(password);
  h.checkphone(phoneNumber);
  // h.checkrole(role);
  h.checkcity(location_city);
  h.checkstate(location_state);
  h.checkzipcode(location_zip_code);
  h.checkbio(bio);
  h.checkCategories(categories);

  firstName = firstName.trim();
  lastName = lastName.trim();
  username = username.trim();
  emailAddress = emailAddress.trim();
  emailAddress = emailAddress.toLowerCase();
  phoneNumber = phoneNumber.trim();
  location_city = location_city.trim(); // Fun fact: there are US cities with a length of 1 character, so we don't need to test for min length!
  location_state = location_state.trim(); // should we make a drop down?
  location_zip_code = location_zip_code.trim();
  bio = bio.trim();
  for (let i in categories) {
    categories[i] = categories[i].trim();
  }

  const hashLen = 16;
  const hashPassword = await bcrypt.hash(password, hashLen);

  // role = role.trim();

  // location_city:

  // Again, here we can and should do CSS styling to preview desired input for user

  if (bio === "") throw new Error("Bio must not be empty");

  // categories

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

// export const checkUser = async (emailAddress, password) => {
//   h.checkemail(emailAddress);
//   h.checkpassword(password);
//   const emailExistUser = await userCollection.findOne({
//     emailAddress: emailAddress,
//   });
//   if (emailExistUser === null)
//     throw `Either the email address or password is invalid`;
//   const checkedPassword = await bcrypt.compare(
//     password,
//     emailExistUser.password
//   );
//   if (!checkedPassword) throw "Either the email address or password is invalid";

//   return {
//     authentication: true,
//     firstName: emailExistUser.firatName,
//     lastName: emailExistUser.lastName,
//     emailAddress: emailExistUser.emailAddress,
//     role: emailExistUser.role,
//   };
// };

// get users by category:
// let userReturn = {
//   _id: users_byCategory._id.toString(),
//   firstName: users_byCategory.firstName,
//   lastName: users_byCategory.lastName,
//   emailAddress: users_byCategory.emailAddress,
//   phoneNumber: users_byCategory.phoneNumber,
//   role: users_byCategory.role,
//   categories: users_byCategory.categories,
//   location_city: users_byCategory.location_city,
//   location_state: users_byCategory.location_state
// }
// return userReturn; --------> this way would only return 1 user
