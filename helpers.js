import { ObjectId } from 'mongodb';

function isvalid(value, variable) {

  if (!value) throw new Error(`${variable} is not provided`);
  if (!value.trim()) throw new Error (`Empty spaces are not valid in ${variable}.`);

};

function checkname(Name, varName) {

  isvalid(Name, varName);

  const letterPattern = /^[a-zA-Z]+$/;
  if (!letterPattern.test(Name)) throw new Error(`${varName} must contain only letters`);
  const min = 2;
  const max = 25;

  if (Name.length < min || Name.length > max) throw new Error(`${varName} must be at least ${min} characters and no longer than ${max} characters`);
  
  Name = Name.trim();
};

export const checkfirstname = (name) => {
  checkname(name, "FirstName");
};

export const checklastname = (name) => {
  checkname(name, "LastName");
};


export const checkemail = (email) => {
  isvalid(email, "Email");

  if (typeof email !== 'string') throw new Error("email address must be of type string");

  const emailAddressRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailAddressRegEx.test(email)) throw new Error(`Please enter a valid email address`);
  if (email.trim() === "") throw new Error("Email must not be an empty field");
  email = email.trim();
  email = email.toLowerCase();    // here? or in corresponding code?
};

export const checkpassword = (password) => {

  const hasUpperCase = /[A-Z]/;
  const hasNumber = /\d/;
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

  if (typeof password !== "string") throw new Error("password must be of type string");
  if (password.includes(" ")) throw new Error("Password can not contain spaces");
  if (password.trim() !== password) throw new Error(`Password cannot contain spaces`);
  if (!hasUpperCase.test(password)) throw new Error(`Password must contain at least one uppercase letter`);
  if (password.length < 8) throw new Error(`Password must be at least 8 characters long`);
  if (!hasNumber.test(password)) throw new Error(`Password must contain at least one number`);
  if (!hasSpecialChar.test(password)) throw new Error(`Password must contain at least one special character`);

  // return true; --> I don't think we want to return anything as long as nothing throws
};

export const checkrole = (role) => {

  isvalid(role, "Role");
  role = role.trim();
  role = role.toLowerCase();
  if (role !== "provider" && role !== "seeker") throw new Error('Invalid role specified. Only "Provider" or "Seeker" are allowed.');

};

export const checkphone = (phone) => {

  isvalid(phone, "PhoneNumber");

  const phoneNumberRegex = /^\d{10}$/;
  phone = phone.replace(/[- ()]/g, "");
  const phoneNumber = phone.trim();
  // console.log(phoneNumber);
  if (!phoneNumberRegex.test(phoneNumber)) throw new Error(`Please enter a valid 10 digit phone number`);
};

export const checkzipcode = (zip) => {
  isvalid(zip, "Zip");

  const zipRegex = /^\d{5}(?:[-\s]\d{4})?$/;
  if (typeof zip !== "string") throw new Error("Location: zip code should be of type string");
  zip = zip.trim();
  if (zip === "") throw new Error("Location: zip code can not be an empty field");
  if (!zipRegex.test(zip)) throw new Error(`Please enter a valid 5 digit zip code`);
};
export const checkcity = (city) => {
  isvalid(city, "City");
  if (typeof city !== "string") throw new Error("Location: city must be of type string");
  city = city.trim();
  if (city === "") throw new Error("Location: city can not be an empty field");
  for (let i in city) {
    if (typeof city[i] === "number") throw new Error(`Location: city should not contain numbers`);
  }
};

export const checkstate = (state) => {
  isvalid(state, "State");
  if (typeof state !== "string") throw new Error("Location: state must be of type string");
  state = state.trim();
  if (state === "") throw new Error("Location: state can not be an empty field");
  for (let i in state) {
    if (typeof state[i] === "number") throw new Error(`Location: state should not contain numbers`);
  }
  if (state.length !== 2) throw new Error("Location: state must be exactly 2 letters");
};

export const checkRating = (rating) => {
  isvalid(rating, "rating");
  if (typeof rating !== "number") throw new Error("rating must be a number");
  if (rating > 5 || rating < 0) throw new Error("rating can not be less than 0 or greater than 5");
};

export const checkValidUserID = (userId) => {
  isvalid(userId, "userId");
  if (typeof userId !== "string") throw new Error("userId must be of type string");
  userId = userId.trim();
  if (!ObjectId.isValid(userId)) throw new Error("userId is not a valid ObjectId");
}

export const checkValidRevieweeId = (revieweeId) => {
  isvalid(revieweeId, "revieweeId");
  if (typeof revieweeId !== "string") throw new Error("revieweeId must be of type string");
  revieweeId = revieweeId.trim();
  if (!ObjectId.isValid(revieweeId)) throw new Error("revieweeId is not a valid ObjectId");
}

export const checkValidProjectId = (projectId) => {
  isvalid(projectId, "proejctId");
  if (typeof projectId !== "string") throw new Error("projectId must be of type string");
  projectId = projectId.trim();
  if (!ObjectId.isValid(projectId)) throw new Error("projectId is not a valid ObjectId");
}

export const checkReview = (comment) => {
  isvalid(comment, "comment");
  if (typeof comment !== 'string') throw new Error("comment must be of type string");
  if (comment.length > 2500) throw new Error("comment has a maximum length of 2500 characters");
  if (comment.trim() === "") throw new Error("comment must not be empty");
}

export const selfReview = (userId, revieweeId) => {
  if (userId === revieweeId) throw new Error("You can not leave a review for yourself!");
}

export const checkbio = (bio) => {
  if (typeof bio !== "string") throw new Error("Bio must be of type string");
  bio = bio.trim();
  if (bio.length > 5000) throw new Error("You can not submit a bio longer than 5000 characters");
//  if (bio === "") throw new Error("You can't submit an empty bio!");

};

export const checkCategories = (categories) => {
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
};