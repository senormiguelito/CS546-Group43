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

const checkemail = async (email) => {
  checkvalid(email, "Email");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return `Not a valid email!!`;
};

const checkphone = (phone) => {
  const phoneNumberRegex = /^\d{10}$/;
  phone = phone.replace(/[-()]/g, "");
  phoneNumber = phone.trim();
  // console.log(phoneNumber);
  if (!phoneNumberRegex.test(phoneNumber))
    return `Please enter your phone number in the proper displayed format`;
};

const checkzipcode = (zip) => {
  checkvalid(zip, "Zip");

  const zipRegex = /^\d{5}(?:[-\s]\d{4})?$/;
  if (typeof zip !== "string")
    return "Location: zip code should be of type string";
  zip = zip.trim();
  if (zip === "") return "Location: zip code can not be an empty field";
  if (!zipRegex.test(zip)) return `Please enter a valid 5 digit zip code`;
};

const checkcity = (city) => {
  checkvalid(city, "City");
  if (typeof city !== "string") return "Location: city must be of type string";
  city = city.trim();
  if (city === "") return "Location: city can not be an empty field";
  for (let i in city) {
    if (typeof city[i] === "number")
      return `Location: city should not contain numbers`;
  }
};

const checkstate = (state) => {
  checkvalid(state, "State");
  if (typeof state !== "string")
    return "Location: state must be of type string";
  state = state.trim();
  if (state === "") return "Location: state can not be an empty field";
  for (let i in state) {
    if (typeof state[i] === "number")
      return `Location: state should not contain numbers`;
  }
  if (state.length !== 2) return "Location: state must be exactly 2 letters";
  state = state.toUpperCase(); // no inconsistencies
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

const checkAge = () => {
  const dob = new Date(document.getElementById("dob").value);
  // console.log("hii ", dob);
  const age = Date.now() - dob.getTime();
  const ageInYears = age / 1000 / 60 / 60 / 24 / 365;

  if (ageInYears < 13) {
    return "You must be 13 years of age or older to register.";
  }
};

const checkbio = (bio) => {
  if (typeof bio !== "string") return `Bio must be of type string`;
  bio = bio.trim();
  if (bio.length > 5000)
    return `You can not submit a bio longer than 5000 characters`;
  //  if (bio === "") return("You can't submit an empty bio!");
};

const checkCategories = (categories) => {
  if (categories) {
    // double check with categories, how we want it input as, when taking in the 'getUsersByCategory' func
    if (!Array.isArray(categories))
      return "Update: categories must be an array";
    if (categories.length < 1)
      return "Update: you must supply at least 1 category";
    for (let i in categories) {
      const letterPattern = /^[a-zA-Z]+$/;
      categories[i] = categories[i].trim();
      if (!letterPattern.test(categories[i])) {
        return `catagories must contain only alphabets from js `;
      }
    }
  }
};

const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");

const commentForm = document.getElementById("comment-form");
const editprofileForm = document.getElementById("myprofile-edit");
const resetButton = document.getElementById("reset-button");
const firstname = document.getElementById("firstNameInput");
// console.log(firstname);
const lastname = document.getElementById("lastNameInput");
const bio = document.getElementById("bioInput");
const emailaddress = document.getElementById("emailAddressInput");
const phone = document.getElementById("phoneNumberInput");
const role = document.getElementById("roleInput");
const password = document.getElementById("passwordInput");
const confirmpassword = document.getElementById("confirmPasswordInput");
const errorDiv = document.getElementById("error");
const categoryInput = document.getElementById("categoryInput");
const addCategoryButton = document.getElementById("addCategoryButton");
const categoryList = document.getElementById("categoryList");
const categories = [];
const img = document.querySelector("#myImage");
const imgInput = document.querySelector("#myImageInput");

imgInput.addEventListener("change", () => {
  let reader = new FileReader();
  reader.readAsDataURL(imgInput.files[0]);
  reader.addEventListener("load", () => {
    img.src = reader.result;
  });
});

const createPostForm = document.getElementById("create-post-form");

// Listen for the form's "load" event
createPostForm.addEventListener("load", () => {
  // Clear the session storage
  sessionStorage.clear();
});

const inputs = document.querySelectorAll("#signup-form input");

inputs.forEach((input) => {
  input.addEventListener("change", saveFormData);
});

function saveFormData() {
  inputs.forEach((input) => {
    sessionStorage.setItem(input.id, input.value);
  });
}

function restoreFormData() {
  inputs.forEach((input) => {
    // console.log("this is input id", input.id);
    input.value = sessionStorage.getItem(input.id) || "";
  });
}
if (resetButton) {
  resetButton.addEventListener("click", () => {
    // Reset the form to its initial state
    signupForm.reset();
    // console.log("hiiiiiii");
    // Clear the sessionStorage
    sessionStorage.clear();
    window.location.href = "/signup";
  });
}

// Call the restoreFormData() function when the page is loaded
document.addEventListener("DOMContentLoaded", restoreFormData);

const zip = document.getElementById("zipInput");
const city = document.getElementById("cityInput");
const state = document.getElementById("stateInput");

window.onload = function () {
  const zipCode = sessionStorage.getItem("zipInput");
  if (zipCode) {
    if (zipCode.length === 5) {
      const url = `https://api.zippopotam.us/us/${zipCode}`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const autocity = data.places[0]["place name"];
          const autostate = data.places[0]["state abbreviation"];
          if (city && state) {
            city.value = autocity;
            state.value = autostate;
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }
};

if (zip) {
  zip.addEventListener("change", () => {
    const zipcode = zip.value;
    console.log(zipcode);
    if (zipcode.length === 5) {
      const url = `https://api.zippopotam.us/us/${zipcode}`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const autocity = data.places[0]["place name"];
          const autostate = data.places[0]["state abbreviation"];
          if (city && state) {
            city.value = autocity;
            state.value = autostate;
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  });
}

const formatPhoneNumber = () => {
  // console.log("calling the format the number function");
  const cleaned = phone.value.replace(/\D/g, "");
  const tenOnly = cleaned.slice(0, 10);
  const match = tenOnly.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    phone.value = "(" + match[1] + ") " + match[2] + "-" + match[3];
  } else {
    phone.value = tenOnly;
  }
};

if (phone) {
  // console.log(phone.value);
  phone.addEventListener("input", formatPhoneNumber);
  formatPhoneNumber();
}

if (signupForm) {
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    errorDiv.hidden = true;
    let error;

    error = checkfirstname(firstname.value);
    error = checklastname(lastname.value);
    error = checkemail(emailaddress.value);
    // console.log(phone.value);
    error = checkphone(phone.value);
    error = checkpassword(password.value);
    error = checkpassword(confirmpassword.value);
    error = checkrole(role.value);

    error = checkAge();
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
      signupForm.submit();
    }
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = emailaddress.value;
    const pass = password.value;
    let error;
    errorDiv.hidden = true;

    if (email && pass) {
      error = checkemail(email);
      error = checkpassword(pass);
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

const modal = document.getElementById("modal");
const closeBtn = document.getElementsByClassName("close")[0];
if (modal) {
  document
    .querySelector("a[href='#modal']")
    .addEventListener("click", function () {
      modal.style.display = "block";
    });

  closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });

  document.getElementById("send-btn").addEventListener("click", function () {
    modal.style.display = "none";
  });
}
if (editprofileForm) {
  editprofileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    errorDiv.hidden = true;
    let error;

    error = checkfirstname(firstname.value);
    error = checklastname(lastname.value);
    error = checkAge();
    error = checkbio(bio.value);
    error = checkemail(emailaddress.value);
    error = checkphone(phone.value);
    error = checkCategories(categories);
    error = checkzipcode(zip.value);
    error = checkcity(city.value);
    error = checkstate(state.value);

    if (error) {
      errorDiv.hidden = false;
      errorDiv.textContent = error;
      window.history.replaceState({}, document.title, "?status=400");
    } else {
      editprofileForm.submit();
    }
  });
}

const ListOfcategories = [
  "Electrician",
  "Plumber",
  "Carpenter",
  "Welder",
  "Mechanic",
  "Painter",
  "Mason",
  "Landscaper",
  "HVAC technician",
  "Roofing contractor",
  "Flooring specialist",
  "Pest control specialist",
  "Cleaner",
  "Interior designer",
  "Architect",
  "General contractor",
  "Handyman",
  "Pool technician",
  "Security system technician",
  "Audio-visual technician",
];

const categoryOptions = document.createElement("datalist");
categoryOptions.setAttribute("id", "category-options");
for (let i = 0; i < ListOfcategories.length; i++) {
  const option = document.createElement("option");
  option.value = ListOfcategories[i];
  categoryOptions.appendChild(option);
}
document.body.appendChild(categoryOptions);
if (categoryInput) {
  categoryInput.addEventListener("input", () => {
    const inputVal = categoryInput.value;
    const options = categoryOptions.getElementsByTagName("option");

    for (let i = 0; i < options.length; i++) {
      const optionVal = options[i].value.toLowerCase();
      if (optionVal.includes(inputVal.toLowerCase())) {
        options[i].hidden = false;
      } else {
        options[i].hidden = true;
      }
    }
  });
}

//delete categories

const divfordelete = document.getElementById("category-box");
const divDataInput = document.getElementById("categorydata");
const addintohiddnediv = () => {
  const AllName = document.querySelectorAll(".category-name");
  let newarr = [];
  if (!AllName == 0) {
    AllName.forEach((element) => {
      newarr.push(element.textContent); // Get data from div tags and store in array
      console.log("--------" + newarr);
    });
    newarr = newarr.split(",").map((s) => s.trim().replace(/"/g, ""));
  } else {
    newarr = [];
  }
  // Set hidden input field value to the data array
  for (let i in newarr)
    if (newarr[i] !== "") {
      console.log(newarr[i]);
      divDataInput.value = newarr;
      // if (!categories.includes(categories[i])) {
      //   divDataInput.value += `"${categories[i]}",`;
      // }
      console.log(newarr);
    }
};

const deleteButtons = document.querySelectorAll(".delete-button");
if (deleteButtons) {
  deleteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // get the parent div element and remove it from the DOM
      button.parentNode.remove();
    });
    button.addEventListener("click", addintohiddnediv);
  });
}
const mainbox = document.getElementById("category-container");
if (mainbox) {
  mainbox.addEventListener("change", addintohiddnediv);
}

// add event listener to the button to add a category
if (addCategoryButton) {
  addCategoryButton.addEventListener("click", () => {
    errorDiv.hidden = true;
    console.log("YES YOU CLICKED ADD BUTTON");

    const category = categoryInput.value.trim();

    const options = categoryOptions.getElementsByTagName("option");
    let error;

    let isValidCategory = false;
    for (let i = 0; i < options.length; i++) {
      if (options[i].value === category) {
        isValidCategory = true;
        break;
      }
    }
    if (!isValidCategory) {
      error = `you can not enter this category : "${category}", you are only allowed to select from the option`;
    }
    const letterPattern = /^[a-z A-Z]+$/;
    if (!letterPattern.test(category)) {
      if (category.trim() == "") error = `can not add empty category`;
      else error = `Numbers are not allowed in : "${category}"`;
    }
    if (categories.includes(category)) {
      error = `You can not enter same categories again`;
    }
    if (!error) {
      // check if the category is not empty and not already in the list
      if (category) {
        // check if there are less than 4 categories in the list
        if (categories.length < 4) {
          categories.push(category);
          // create a new category element and append it to the list
          const divBox = document.createElement("div");
          divBox.classList.add("category-box"); //<div class="category-box">
          const spanName = document.createElement("span");
          spanName.classList.add("category-name"); //<span class="category-name">
          spanName.textContent = category;
          divBox.appendChild(spanName);

          // delete the category
          const spanDelete = document.createElement("span");
          spanDelete.classList.add("delete-button"); // <span class="delete-button">
          spanDelete.textContent = "x";
          spanDelete.addEventListener("click", () => {
            const categoryIndex = categories.indexOf(category);
            if (categoryIndex > -1) {
              categories.splice(categoryIndex, 1);
            }
            divBox.remove();
            addintohiddnediv();
          });
          divBox.appendChild(spanDelete);
          const categoryContainer = document.querySelector(
            ".category-container"
          );
          categoryContainer.appendChild(divBox);
          categoryInput.value = ""; // clear the input field
          addintohiddnediv();
        } else {
          error = "You can only select up to 4 categories";
        }
      }
    }
    if (error) {
      errorDiv.hidden = false;
      errorDiv.textContent = error;
      window.history.replaceState({}, document.title, "?status=400");
    }
  });
}

window.addEventListener("change", addintohiddnediv); // on window change anything
