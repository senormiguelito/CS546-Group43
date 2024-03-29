import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import * as h from "../helpers.js";
import { user } from "../config/mongoCollections.js";
import axios from "axios";
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
  location_state,
  joiningDate
  // categories,     // initialize empty []
  // bio,            // initialize ""
  // reviews,        // initialize empty []
  // projects,       // initialize empty []
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
  phoneNumber = phoneNumber.replace(/[- ()]/g, "").trim();
  password = password.trim();
  role = role.trim();
  location_zip_code = location_zip_code.trim();
  location_city = location_city.trim();
  location_state = location_state.toUpperCase().trim();
  joiningDate = h.getJoiningDate();

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
      dob: date_of_birth,
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
      joiningDate: joiningDate,
      imageData: "",
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
  // const userById = await userCollection.findOne({_id: new ObjectId(thisUser._id)  }); // good?
  if (!thisUser)
    throw `No user registered with this email "${emailAddress}", Register now.`; // not error, it's a validation message that user can see at the login page.

  const hashedPass = thisUser.password;

  const bcryptCompare = await bcrypt.compare(password, hashedPass);
  if (bcryptCompare) {
    return {
      thisUser,
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
  if (!userData) throw `No userData with that id`;
  userData._id = userData._id.toString();
  return userData;
  // gotta double check what you want on return object
};

export const getUserByEmail = async (email) => {
  // implementing so that we can easily start a message with a user from 'Messages' in tool bar
  if (!email) throw new Error("getUserByEmail: no email provided");
  h.checkemail(email);
  const userByEmail = await userCollection.findOne({ emailAddress: email });
  if (!userByEmail)
    throw `No user with that email in our database. If you know them personally, invite them to join!`;
  const user_to_ID = userByEmail._id.toString(); // again double check with group

  return user_to_ID; // talk with vamsi
};

export const getUsersBy = async (role) => {
  h.checkrole(role);
  const usersArray = await userCollection.find({ role: role }).toArray();
  usersArray.forEach((user) => {
    user._id = user._id.toString();
  });
  if (!usersArray || usersArray.length === 0)
    throw `No users found with given role`;
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

  usersByZip.map((user) => {
    user._id = user._id.toString();
  });

  if (!usersByZip || usersByZip.length === 0)
    throw new Error("No users in this zip code found");
  return usersByZip; // double check this return
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
  // password,
  date_of_birth,
  phoneNumber,
  location_city,
  location_state,
  location_zip_code,
  categories,
  bio,
  imageData
) => {
  h.checkfirstname(firstName);
  h.checklastname(lastName);
  h.checkemail(emailAddress);
  // h.checkpassword(password);
  h.checkDOB(date_of_birth);
  h.checkphone(phoneNumber);
  // h.checkrole(role);
  h.checkcity(location_city);
  h.checkstate(location_state);
  h.checkzipcode(location_zip_code);
  bio = bio.trim();
  if (bio) {
    h.checkbio(bio);
  }

  // if (categories) {
  //   h.checkCategories(categories);
  //   for (let i in categories) {
  //     categories[i] = categories[i].trim();
  //   }
  // }

  firstName = firstName.trim();
  lastName = lastName.trim();
  emailAddress = emailAddress.trim().toLowerCase();
  phoneNumber = phoneNumber.replace(/[- ()]/g, "").trim();
  date_of_birth = date_of_birth.trim();
  location_zip_code = location_zip_code.trim();
  location_city = location_city.trim();
  location_state = location_state.toUpperCase().trim();

  // const hashLen = 16;
  // const hashPassword = await bcrypt.hash(password, hashLen);

  // role = role.trim();

  // location_city:

  // Again, here we can and should do CSS styling to preview desired input for user

  // categories

  const updateUserInfo = {
    // only include in here the stuff that makes sense for the user to update
    // password: hashPassword,
    // emailAddress: emailAddress,
    firstName: firstName,
    lastName: lastName,
    phoneNumber: phoneNumber,
    location_city: location_city,
    location_state: location_state,
    location_zip_code: location_zip_code,
    bio: bio,
    categories: categories,
    imageData: imageData,
  };

  // refer to lab 6 albums.js for rating updating , and all this stuff too

  const userUpdate = await userCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateUserInfo }
  );

  if (userUpdate.modifiedCount === 1) {
    const updatedTrue = await userCollection.findOne({ _id: new ObjectId(id) });
    return updatedTrue;
  } else {
    return { notchanged: true };
  }
};

export const sortProvidersByDistance = async (user) => {
  if(!user) throw new Error("could not sort")
  let userList = await getAll();
  if (!userList) throw "can not find users";
  let api_key = "nf919BzJadH9xpBfBcqqbtMrar3kcEhoW9YUw03v02LmV8zrTwUbrlmfj34PDiIa"
  async function getApi(zip_code1, zip_code2) {
    const distanceJson = await axios.get(
      `https://www.zipcodeapi.com/rest/${api_key}/distance.json/${zip_code1}/${zip_code2}/mile`
    );
    return distanceJson;
  }
  let providerUserList = [];
  if (!Array.isArray(userList)) "no user found!";
  userList.forEach((element) => {
    if (element.role === "provider") {
      providerUserList.push(element);
    }
  });

  // UNCOMMENT WHEN YOU WANT TO TEST. WE ONLY HAVE 50 REQ/HR FOR THIS API
  // UNCOMMENT WHEN YOU WANT TO TEST. WE ONLY HAVE 50 REQ/HR FOR THIS API
  // UNCOMMENT WHEN YOU WANT TO TEST. WE ONLY HAVE 50 REQ/HR FOR THIS API

  for (const iterator of providerUserList) {
    let distance = await getApi(user.location_zip_code,iterator.location_zip_code)
    iterator['distance'] = distance.data.distance
  }

  let sortedPosts = providerUserList.sort((p1, p2) =>
    p1.distance > p2.distance ? 1 : p1.distance < p2.distance ? -1 : 0
  );

  return sortedPosts;
};

export const sortSeekersByDistance = async (user) => {
  if(!user) throw new Error("could not perform sort")
  let userList = await getAll();
  if (!userList) throw "can not find users";
  let api_key =
  "nf919BzJadH9xpBfBcqqbtMrar3kcEhoW9YUw03v02LmV8zrTwUbrlmfj34PDiIa";

  async function getApi(zip_code1, zip_code2) {
    const distanceJson = await axios.get(
      `https://www.zipcodeapi.com/rest/${api_key}/distance.json/${zip_code1}/${zip_code2}/mile`
    );
    return distanceJson;
  }
  let seekerUserList = [];
  if (!Array.isArray(userList)) "no user found!";
  userList.forEach((element) => {
    if (element.role === "seeker") {
      seekerUserList.push(element);
    }
  });

  // UNCOMMENT WHEN YOU WANT TO TEST. WE ONLY HAVE 200 REQ/HR FOR THIS API
  // UNCOMMENT WHEN YOU WANT TO TEST. WE ONLY HAVE 200 REQ/HR FOR THIS API
  // UNCOMMENT WHEN YOU WANT TO TEST. WE ONLY HAVE 200 REQ/HR FOR THIS API

  for (const iterator of seekerUserList) {
    let distance = await getApi(user.location_zip_code,iterator.location_zip_code)
    iterator['distance'] = distance.data.distance
  }

  let sortedPosts = seekerUserList.sort((p1, p2) =>
    p1.distance > p2.distance ? 1 : p1.distance < p2.distance ? -1 : 0
  );

  return sortedPosts;
};



export const filterProviderBySearchArea = async (user, searchArea) => {
  if(!user) throw new Error("could not perform seach")
  if(!searchArea) throw new Error("enter search area to search")
  if(typeof searchArea !== 'number') throw new Error('search area must be  a number')
  let userList = await getAll();
  if (!userList) throw "can not find users";
  let api_key =
  "nf919BzJadH9xpBfBcqqbtMrar3kcEhoW9YUw03v02LmV8zrTwUbrlmfj34PDiIa";

  async function getApi(zip_code1, radius) {
    const zipCodes = await axios.get(
      `https://www.zipcodeapi.com/rest/${api_key}/radius.json/${zip_code1}/${radius}/miles?minimal`
    );
    return zipCodes;
  }
  let zipcodes = await getApi(user.location_zip_code, searchArea);
  let providerUserList = [];
  if (!Array.isArray(userList)) "no user found!";
  userList.forEach((element) => {
    if (element.role === "provider") {
      providerUserList.push(element);
    }
  });

  let finalList = [];
  providerUserList.forEach((element) => {
    zipcodes.data.zip_codes.forEach((element1) => {
      if (element.location_zip_code === element1) {
        finalList.push(element);
      }
    });
  });

  return finalList;
};

export const filterSeekerBySearchArea = async (user, searchArea) => {
  if(!user) throw new Error("could not perform seach")
  if(!searchArea) throw new Error("enter search area to search")
  if(typeof searchArea !== 'number') throw new Error('search area must be  a number')
  let userList = await getAll();
  if (!userList) throw "can not find users";
  let api_key =
  "nf919BzJadH9xpBfBcqqbtMrar3kcEhoW9YUw03v02LmV8zrTwUbrlmfj34PDiIa";

  async function getApi(zip_code1, radius) {
    const zipCodes = await axios.get(
      `https://www.zipcodeapi.com/rest/${api_key}/radius.json/${zip_code1}/${radius}/miles?minimal`
    );
    return zipCodes;
  }
  let zipcodes = await getApi(user.location_zip_code, searchArea);
  let seekerUserList = [];
  if (!Array.isArray(userList)) "no user found!";
  userList.forEach((element) => {
    if (element.role === "seeker") {
      seekerUserList.push(element);
    }
  });

  let finalList = [];
  seekerUserList.forEach((element) => {
    zipcodes.data.zip_codes.forEach((element1) => {
      if (element.location_zip_code === element1) {
        finalList.push(element);
      }
    });
  });

  return finalList;
};

export const sortProviderByRating = async () => {
  let userList = await getAll();
  if(!userList) throw new Error("can not find users!")
  let providerlist =[]
  userList.forEach(element => {
    if(element.role === 'provider'){
      providerlist.push(element)
    }
  });
  
  let safeProviderList=[]
  providerlist.forEach(element => {
    if(element.overallRating){
      safeProviderList.push(element)
    }
  });
  let sortedUsers = safeProviderList.sort((p1, p2) =>
    p1.overallRating > p2.overallRating ? 1 : p1.overallRating < p2.overallRating ? -1 : 0
  );
  if(!sortedUsers) throw new Error("could not sort")
  sortedUsers.forEach(element => {
  console.log(element.overallRating,"OR")
  });
  return sortedUsers
};

export const sortSeekerByRating = async () => {
  let userList = await getAll();
  if(!userList) throw new Error("can not find users!")
  let seekerlist =[]
  userList.forEach(element => {
    if(element.role === 'seeker'){
      seekerlist.push(element)
    }
  });
  let safeSeekerList=[]
  seekerlist.forEach(element => {
    if(element.overallRating){
      safeSeekerList.push(element)
    }
  });
  let sortedUsers = safeSeekerList.sort((p1, p2) =>
    p1.overallRating > p2.overallRating ? 1 : p1.overallRating < p2.overallRating ? -1 : 0
  );
  if(!sortedUsers) throw new Error("could not sort")
  sortedUsers.forEach(element => {
  console.log(element.overallRating,"OR")
  });
  return sortedUsers
};
