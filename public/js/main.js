const checkvalid = (value, variable) => {
  if (!value) {
    return `${variable} is not provided`;
  }
  if (!value.trim()) {
    return `Empty spaces are not valid in ${variable}.`;
  }
};

const checkname = (Name, varName) => {
  checkvalid(Name, varName);
  const letterPattern = /^[a-zA-Z]+$/;
  if (!letterPattern.test(Name)) {
    return `${varName} must contain only alphabets from js `;
  }

  const min = 2;
  const max = 25;
  if (Name.length < min || Name.length > max)
    return `${varName} must have a length between ${min} and ${max} characters`;
};

const checkfirstname = (name) => {
  checkname(name, "FirstName");
};

const checklastname = (name) => {
  checkname(name, "LastName");
};

const checkemail = (email) => {
  checkvalid(email, "Email");

  const emailAddress = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailAddress.test(email)) return `Not a valid email!!`;
};

const checkphone = (phone) => {
  const phoneNumberRegex = /^\d{10}$/;
  phone = phone.replace(/[-()]/g, "");
  phoneNumber = phone.trim();
  // console.log(phoneNumber);
  if (!phoneNumberRegex.test(phoneNumber))
    return `Please enter your phone number in the proper displayed format`;
};

const checkpassword = (password) => {
  const hasUpperCase = /[A-Z]/;
  const hasNumber = /\d/;
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

  if (password.trim() !== password) return `Password cannot contain spaces`;
  if (!hasUpperCase.test(password))
    return `Password must contain at least one uppercase letter`;
  if (password.length < 8) return `Password must be at least 8 characters long`;
  if (!hasNumber.test(password))
    return `Password must contain at least one number`;
  if (!hasSpecialChar.test(password))
    return `Password must contain at least one special character`;
};

const checkrole = (role) => {
  checkvalid(role, "Role");

  role = role.toLowerCase();

  if (role !== "provider" && role !== "seeker") {
    return 'Invalid role specified. Only "Provider" or "Seeker" are allowed.';
  }
};
const form = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");
const resetButton = document.getElementById("reset-button");
const firstname = document.getElementById("firstNameInput");
// console.log(firstname);
const lastname = document.getElementById("lastNameInput");
const password = document.getElementById("passwordInput");
const confirmpassword = document.getElementById("confirmPasswordInput");
const emailaddress = document.getElementById("emailAddressInput");
const phone = document.getElementById("phoneNumberInput");
const role = document.getElementById("roleInput");
const zip = document.getElementById("zipInput");
const city = document.getElementById("cityInput");
const state = document.getElementById("stateInput");
const errorDiv = document.getElementById("error");
const inputs = document.querySelectorAll("#signup-form input");

inputs.forEach((input) => {
  input.addEventListener("change", saveFormData);
});

// Save the form data to sessionStorage
function saveFormData() {
  inputs.forEach((input) => {
    sessionStorage.setItem(input.id, input.value);
  });
}

// Restore the form data from sessionStorage
function restoreFormData() {
  inputs.forEach((input) => {
    input.value = sessionStorage.getItem(input.id) || "";
  });
}

resetButton.addEventListener("click", () => {
  // Reset the form to its initial state
  form.reset();

  // Clear the sessionStorage
  sessionStorage.clear();

  window.location.href = "/user/signup";
});

// Call the restoreFormData() function when the page is loaded
document.addEventListener("DOMContentLoaded", restoreFormData);
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    errorDiv.hidden = true;
    let error;

    error = checkfirstname(firstname.value);
    error = checklastname(lastname.value);
    error = checkemail(emailaddress.value);
    console.log(phone.value);
    error = checkphone(phone.value);
    error = checkpassword(password.value);
    error = checkpassword(confirmpassword.value);
    error = checkrole(role.value);
    if (password.value !== confirmpassword.value) {
      // console.log(password.value);
      error = "Passwords is not matched";
    }
    // console.log(error);
    if (error) {
      errorDiv.hidden = false;
      errorDiv.textContent = error;
      // console.log(error);
      window.history.replaceState({}, document.title, "?status=400");
      return;
    } else {
      form.submit();
    }
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const emailAddress = emailaddress.value;
    const password = password.value;
    let error;
    errorDiv.hidden = true;

    if (emailAddress && password) {
      error = checkemail(emailAddress);
      error = checkpassword(password);
    }

    if (error) {
      errorDiv.hidden = false;
      errorDiv.textContent = error;
      window.history.replaceState({}, document.title, "?status=400");
    } else {
      loginForm.submit();
    }
  });
}
