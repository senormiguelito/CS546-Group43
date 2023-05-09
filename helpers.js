import { ObjectId } from "mongodb";

function isvalid(value, variable) {
  if (!value) throw new Error(`${variable} is not provided`);
  if (!value.trim())
    throw new Error(`Empty spaces are not valid in ${variable}.`);
}

function checkname(Name, varName) {
  isvalid(Name, varName);

  const letterPattern = /^[a-zA-Z]+$/;
  if (!letterPattern.test(Name))
    throw new Error(`${varName} must contain only letters`);
  const min = 2;
  const max = 25;

  if (Name.length < min || Name.length > max)
    throw new Error(
      `${varName} must be at least ${min} characters and no longer than ${max} characters`
    );

  Name = Name.trim();
}

export const checkfirstname = (name) => {
  checkname(name, "FirstName");
};

export const checklastname = (name) => {
  checkname(name, "LastName");
};

export const checkDOB = (date_of_birth) => {
  // thoroughly inspect this
  const [year, month, day] = date_of_birth
    .split("-")
    .map((str) => parseInt(str)); // parse each sub-string and convert into an integer
  if (month > 12 || month < 1) throw new Error("Invalid month");
  if (day < 1 || (month === 2 && day > 28) || ((month === 4 || month === 6 || month === 9 || month === 11) && day > 30) || day > 31)
    throw new Error("Invalid date");
  if (year > 2010) throw new Error("You are too young to join. Grow up.");
  if (year < 1900) throw new Error("You're a dinosaur");
  // date_of_birth = date_of_birth.trim();
  // if (releaseDate.length !== 10) throw new Error("Incorrect releaseDate format"); // what is this releas date?
};

export const checkemail = (email) => {
  isvalid(email, "Email");

  if (typeof email !== "string")
    throw new Error("email address must be of type string");

  const emailAddressRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailAddressRegEx.test(email))
    throw new Error(`Please enter a valid email address`);
  if (email.trim() === "") throw new Error("Email must not be an empty field");
  email = email.trim();
  email = email.toLowerCase();
};

export const checkpassword = (password) => {
  const hasUpperCase = /[A-Z]/;
  const hasNumber = /\d/;
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

  if (typeof password !== "string")
    throw new Error("password must be of type string");
  if (password.includes(" "))
    throw new Error("Password can not contain spaces");
  if (password.trim() !== password)
    throw new Error(`Password cannot contain spaces`);
  if (!hasUpperCase.test(password))
    throw new Error(`Password must contain at least one uppercase letter`);
  if (password.length < 8)
    throw new Error(`Password must be at least 8 characters long`);
  if (!hasNumber.test(password))
    throw new Error(`Password must contain at least one number`);
  if (!hasSpecialChar.test(password))
    throw new Error(`Password must contain at least one special character`);

  // return true; --> I don't think we want to return anything as long as nothing throws
};

export const checkrole = (role) => {
  isvalid(role, "Role");
  role = role.trim();
  role = role.toLowerCase();
  if (role !== "provider" && role !== "seeker")
    throw new Error(
      'Invalid role specified. Only "Provider" or "Seeker" are accepted.'
    );
};

export const checkphone = (phone) => {
  isvalid(phone, "PhoneNumber");

  const phoneNumberRegex = /^\d{10}$/;
  phone = phone.replace(/[- ()]/g, "");
  const phoneNumber = phone.trim();
  // console.log(phoneNumber);
  if (!phoneNumberRegex.test(phoneNumber))
    throw new Error(`Please enter a valid 10 digit phone number`);
};

export const checkzipcode = (zip) => {
  isvalid(zip, "Zip");

  const zipRegex = /^\d{5}(?:[-\s]\d{4})?$/;
  if (typeof zip !== "string")
    throw new Error("Location: zip code should be of type string");
  zip = zip.trim();
  if (zip === "")
    throw new Error("Location: zip code can not be an empty field");
  if (!zipRegex.test(zip))
    throw new Error(`Please enter a valid 5 digit zip code`);
};
export const checkcity = (city) => {
  isvalid(city, "City");
  if (typeof city !== "string")
    throw new Error("Location: city must be of type string");
  city = city.trim();
  if (city === "") throw new Error("Location: city can not be an empty field");
  for (let i in city) {
    if (typeof city[i] === "number")
      throw new Error(`Location: city should not contain numbers`);
  }
};

export const checkstate = (state) => {
  isvalid(state, "State");
  if (typeof state !== "string")
    throw new Error("Location: state must be of type string");
  state = state.trim();
  if (state === "")
    throw new Error("Location: state can not be an empty field");
  for (let i in state) {
    if (typeof state[i] === "number")
      throw new Error(`Location: state should not contain numbers`);
  }
  if (state.length !== 2)
    throw new Error("Location: state must be exactly 2 letters");
  state = state.toUpperCase(); // no inconsistencies
};

export const checkRating = (rating) => {
  // isvalid(rating, "rating"); //bruhhhh integer can't be trimmed );
  if (typeof rating !== "number") throw new Error("rating must be a number");
  if (rating > 5 || rating < 1)
    throw new Error("rating can not be less than 1 or greater than 5");
};

export const checkValid = (userId) => {
  if (typeof userId !== "string")
    throw new Error("userId must be of type string");
  userId = userId.trim();
  if (userId === "") throw new Error("userId must not be an empty field");
  if (!ObjectId.isValid(userId))
    throw new Error("userId is not a valid ObjectId");
};

export const checkId = (id) => {
  isvalid(id, "id");
  if (typeof id !== "string") throw new Error("Id must be of type string");
  id = id.trim();
  if (id === "") throw new Error("id must not be empty");
  if (!ObjectId.isValid(id)) throw new Error("This id is not a valid ObjectId");
};

export const checkValidRevieweeId = (revieweeId) => {
  isvalid(revieweeId, "revieweeId");
  if (typeof revieweeId !== "string")
    throw new Error("revieweeId must be of type string");
  revieweeId = revieweeId.trim();
  if (!ObjectId.isValid(revieweeId))
    throw new Error("revieweeId is not a valid ObjectId");
};

export const checkValidProjectId = (projectId) => {
  isvalid(projectId, "proejctId");
  if (typeof projectId !== "string")
    throw new Error("projectId must be of type string");
  projectId = projectId.trim();
  if (!ObjectId.isValid(projectId))
    throw new Error("projectId is not a valid ObjectId");
};

export const checkReview = (comment) => {
  isvalid(comment, "comment");
  if (typeof comment !== "string")
    throw new Error("comment must be of type string");
  if (comment.length > 2500)
    throw new Error("comment has a maximum length of 2500 characters");
  if (comment.trim() === "") throw new Error("comment must not be empty");
};

export const selfReview = (userId, revieweeId) => {
  if (userId === revieweeId)
    throw new Error("You can not leave a review for yourself!");
};

export const checkTitle = (title) => {
  isvalid(title, "title");
  if (typeof title != "string") throw new Error("Title must be a string");
  title = title.trim();
  if (title.length > 200)
    throw new Error("Title must be no more than 200 characters");
  if (title.trim() === "") throw new Error("Title must be supplied!");
};
export const checkDescription = (description) => {
  isvalid(description, "description");
  if (typeof description !== "string")
    throw new Error("description must be a string");
  description = description.trim();
  if (description.trim() === "")
    throw new Error("description must not be empty");
  if (description.length > 2500)
    throw new Error("description must no more than 2500 characters");
};
export const checkbio = (bio) => {
  // not calling 'isvalid' because not required? Someone help me out if thats true/false
  if (typeof bio !== "string") throw new Error("Bio must be of type string");
  bio = bio.trim();
  if (bio.length > 5000)
    throw new Error("You can not submit a bio longer than 5000 characters");
  //  if (bio === "") throw new Error("You can't submit an empty bio!");
};

export const checkComment = (comment) => {
  isvalid(comment, "comment");
  if (typeof comment !== "string") throw new Error("Comment must be a string");
  comment = comment.trim();
  if(comment.length === 0) throw new Error("Comment should be non-empty string") //I think we need this
  if (comment.length > 250) throw new Error("Comment must be 250 characters or less!"); // implement maxlength in html
}

export const checkCategories = (categories) => {
  if (!categories) throw new Error("categories not provided");
  // double check with categories, how we want it input as, when taking in the 'getUsersByCategory' func
  if (!Array.isArray(categories))
    throw new Error("Update: categories must be an array");
  if (categories.length < 1)
    throw new Error("Update: you must supply at least 1 category");
  for (let i in categories) {
    if (typeof categories[i] !== "string")
      throw new Error("Update: each category must be a string");
    categories[i] = categories[i].trim();
    for (let j in categories[i]) {
      if (typeof categories[i][j] === "number")
        throw new Error("Update: invalid category response");
    }
  }
};

export const checkbudget = (budget) => {
  if (!budget) throw new Error("no budget provided");
  budget = parseInt(budget);
  if (typeof budget !== "number")
    throw new Error("budget should be a valid number"); // it was allowing NaN's
  if (!budget) throw new Error("budget can only be in numbers!"); // so had to add this
  if (budget <= 0) throw new Error("Budget can not be a negative number!");
};

export const checkstatus = (status) => {
  isvalid(status, "Project Status");
  status = status.trim();
  status = status.toLowerCase();
  if (
    status !== "not started" &&
    status !== "in progress" &&
    status !== "finished"
  )
    throw new Error(
      'Invalid project status specified. Only "not started", "in progress" or "finished" are allowed.'
    );
};

export const getJoiningDate = () => {
  let date = new Date(); // get current date
  let year = date.getFullYear();
  let month = (date.getMonth() + 1).toString().padStart(2, "0"); // add leading zero
  let day = date.getDate().toString().padStart(2, "0"); // add leading zero
  let joinedDate = `${year}-${month}-${day}`; // format date as "YYYY-MM-DD"
  return joinedDate;
};

export const checkprospects = (prospects) => {
  if (!prospects) throw new Error("prospects not provided");
  // double check with categories, how we want it input as, when taking in the 'getUsersByCategory' func
  if (!Array.isArray(prospects))
    throw new Error("Update: prospects must be an array");
  
  for (let i in prospects) {
    if (typeof prospects[i] !== "string")
      throw new Error("Update: each prospect must have type string");
    prospects[i] = prospects[i].trim();
    for (let j in prospects[i]) {
      if (typeof prospects[i][j] === "number")
        throw new Error("Update: invalid prospect response");
    }
  }
};
