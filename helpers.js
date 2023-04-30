import { ObjectId } from 'mongodb';

function isvalid(value, variable) {
  if (!value) throw `${variable} is not provided`;
  if (!value.trim()) {
    throw `Empty spaces are not valid in ${variable}.`;
  }
}

function checkname(Name, varName) {
  isvalid(Name, varName);
  const letterPattern = /^[a-zA-Z]+$/;
  if (!letterPattern.test(Name)) {
    throw `${varName} must contain only letters`;
  }
  const min = 2;
  const max = 25;
  if (Name.length < min || Name.length > max)
    throw `${varName} must be at least ${min} characters and no longer than ${max} characters`;
}

export const checkfirstname = (name) => {
  checkname(name, "FirstName");
};

export const checklastname = (name) => {
  checkname(name, "LastName");
};

export const checkemail = async (email) => {
  isvalid(email, "Email");

  const emailAddress = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailAddress.test(email)) throw `Please enter a valid email`;
};

export const checkpassword = (password) => {
  const hasUpperCase = /[A-Z]/;
  const hasNumber = /\d/;
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

  if (password.trim() !== password) throw `Password cannot contain spaces`;
  if (!hasUpperCase.test(password))
    throw `Password must contain at least one uppercase letter`;
  if (password.length < 8) throw `Password must be at least 8 characters long`;
  if (!hasNumber.test(password))
    throw `Password must contain at least one number`;
  if (!hasSpecialChar.test(password))
    throw `Password must contain at least one special character`;

  return true;
};

export const checkrole = (role) => {
  isvalid(role, "Role");

  role = role.toLowerCase();

  if (role !== "provider" && role !== "seeker") {
    throw 'Invalid role specified. Only "Provider" or "Seeker" are allowed.';
  }
};

export const checkphone = (phone) => {
  isvalid(phone, "PhoneNumber");

  const phoneNumberRegex = /^\d{10}$/;
  phone = phone.replace(/[-()]/g, "");
  const phoneNumber = phone.trim();
  // console.log(phoneNumber);
  if (!phoneNumberRegex.test(phoneNumber))
    throw `Please enter a valid 10 digit phone number`;
};

export const checkzip = (zip) => {
  isvalid(zip, "Zip");

  const zipRegex = /^\d{5}(?:[-\s]\d{4})?$/;
  zip = zip.trim();
  if (!zipRegex.test(zip)) throw `Please enter a valid 5 digit zip code`;
};
export const checkcity = (city) => {
  isvalid(city, "City");
  city = city.trim();
  for (let i in city) {
    if (typeof city[i] === "number")
      throw `Location: city should not contain numbers`;
  }
};

export const checkstate = (state) => {
  isvalid(state, "State");
  state = state.trim();
  for (let i in state) {
    if (typeof state[i] === "number")
      throw `Location: state should not contain numbers`;
  }
};

export const checkRating = (rating) => {
  isvalid(rating, "rating");
  if (typeof rating !== "number") throw new Error("rating must be a number");
  if (rating > 5 || rating < 0) throw new Error("rating can not be less than 0 or greater than 5");
};

export const checkValidUserID = (userId) => {
  isvalid(userId, "userId");
  if (!ObjectId.isValid(userId)) throw new Error("userId is not a valid ObjectId");
}

export const checkValidRevieweeId = (revieweeId) => {
  isvalid(revieweeId, "revieweeId");
  if (!ObjectId.isValid(revieweeId)) throw new Error("revieweeId is not a valid ObjectId");
}

export const checkValidProjectId = (projectId) => {
  isvalid(projectId, "proejctId");
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
