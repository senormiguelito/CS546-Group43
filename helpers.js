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
    throw `${varName} must contain only alphabets`;
  }
  const min = 2;
  const max = 25;
  if (Name.length < min || Name.length > max)
    throw `${varName} must have a length between ${min} and ${max} characters`;
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
  if (!emailAddress.test(email)) throw `Not a valid email!!`;
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
    throw `Please enter valid phone number, It should be 10 digit`;
};

export const checkzip = (zip) => {
  isvalid(zip, "Zip");

  const zipRegex = /^\d{5}(?:[-\s]\d{4})?$/;
  zip = zip.trim();
  if (!zipRegex.test(zip)) throw `Invalid zip code, It should be 5 digit only`;
};
export const checkcity = (city) => {
  isvalid(city, "City");
  city = city.trim();
  for (let i in city) {
    if (typeof city[i] === "number")
      throw `Location: city can not contain numbers`;
  }
};

export const checkstate = (state) => {
  isvalid(state, "State");
  state = state.trim();
  for (let i in state) {
    if (typeof state[i] === "number")
      throw `Location: state can not contain numbers`;
  }
};
