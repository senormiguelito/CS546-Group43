const checkvalid = (value, variable) => {
  if (!value) {
    throw `${variable} is not provided`;
  }
  if (!value.trim()) {
    throw `Empty spaces are not valid in ${variable}.`;
  }
};

const checkname = (Name, varName) => {
  checkvalid(Name, varName);
  const letterPattern = /^[a-zA-Z]+$/;
  if (!letterPattern.test(Name)) {
    throw `${varName} must contain only alphabets from js `;
  }

  const min = 2;
  const max = 25;
  if (Name.length < min || Name.length > max)
    throw `${varName} must have a length between ${min} and ${max} characters`;
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
  if (!emailRegex.test(email)) throw `Not a valid email!!`;
};

const checkphone = (phone) => {
  const phoneNumberRegex = /^\d{10}$/;
  phone = phone.replace(/[-( )]/g, "");
  phoneNumber = phone.trim();
  // console.log(phoneNumber);
  if (!phoneNumberRegex.test(phoneNumber)) {
    throw `Please enter your phone number in the proper displayed format`;
  }
};

const checkzipcode = (zip) => {
  checkvalid(zip, "Zip");

  const zipRegex = /^\d{5}(?:[-\s]\d{4})?$/;
  if (typeof zip !== "string")
    throw "Location: zip code should be of type string";
  zip = zip.trim();
  if (zip === "") throw "Location: zip code can not be an empty field";
  if (!zipRegex.test(zip)) throw `Please enter a valid 5 digit zip code`;
};

const checkcity = (city) => {
  checkvalid(city, "City");
  if (typeof city !== "string") throw "Location: city must be of type string";
  city = city.trim();
  if (city === "") throw "Location: city can not be an empty field";
  for (let i in city) {
    if (typeof city[i] === "number")
      throw `Location: city should not contain numbers`;
  }
};

const checkstate = (state) => {
  checkvalid(state, "State");
  if (typeof state !== "string") throw "Location: state must be of type string";
  state = state.trim();
  if (state === "") throw "Location: state can not be an empty field";
  for (let i in state) {
    if (typeof state[i] === "number")
      throw `Location: state should not contain numbers`;
  }
  if (state.length !== 2) throw "Location: state must be exactly 2 letters";
};

const checkpassword = (password) => {
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
};

const checkrole = (role) => {
  checkvalid(role, "Role");

  role = role.toLowerCase();

  if (role !== "provider" && role !== "seeker") {
    throw 'Invalid role specified. Only "Provider" or "Seeker" are allowed.';
  }
};

const checkAge = () => {
  const dob = new Date(document.getElementById("dob").value);
  // console.log("hii ", dob);
  const age = Date.now() - dob.getTime();
  const ageInYears = age / 1000 / 60 / 60 / 24 / 365;

  if (ageInYears < 13) {
    throw "You must be 13 years of age or older to register.";
  }
};

const checkbio = (bio) => {
  if (typeof bio !== "string") throw `Bio must be of type string`;
  bio = bio.trim();
  if (bio.length > 5000)
    throw `You can not submit a bio longer than 5000 characters`;
  //  if (bio === "") throw  (("You can't submit an empty bio!");
};

const checkCategories = (categories) => {
  if (categories) {
    // double check with categories, how we want it input as, when taking in the 'getUsersByCategory' func
    if (!Array.isArray(categories)) throw "Update: categories must be an array";
    for (let i in categories) {
      const letterPattern = /^[a-z A-Z]+$/;
      categories[i] = categories[i].trim();
      if (!letterPattern.test(categories[i])) {
        throw `catagories must contain only alphabets from js `;
      }
    }
  }
};

const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");

const commentForm = document.getElementById("comment-form");
commentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const comment = document.getElementById("postCommentInput").value;
  const errorContainer = document.getElementById("posterror");
  const errors = [];
  if(comment.trim() === ""){
    errors.push("Comment cannot be empty");
  }
  if(errors.length > 0){
    errorContainer.innerText = errors.join(", ");
    errorContainer.style.display = "block";
    // showing the error only for 1.5 seconds.
    setTimeout(function () {
      errorContainer.style.display = "none";
    }, 1500);
  }
});

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
const createPostBtn = document.getElementById("createPost");
if (createPostBtn) {
  createPostBtn.addEventListener("click", (event) => {
    sessionStorage.clear(); // clear the session from client side when user click on create post btn, becasue of city and state autofilling bug.
  });
}

// (function ($) {
//   const deletePostHandler = async (event) => {
//     console.log("you entered into delete ajax.");
//     try {
//       event.preventDefault();
//       const button = $(event.currentTarget);
//       const postId = button.data("id");
//       let deleteReq = {
//         method: "POST",
//         url: `/post/${postId}/delete`,
//         contentType: "application/json",
//         data: JSON.stringify({
//           id: postId,
//         }),
//       };
//       $.ajax(deleteReq).then(function (responseMessage) {
//         console.log(responseMessage);
//       });
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   $(".deletePostbtn").on("click", deletePostHandler);
// })(window.jQuery);

(function ($) {
  const deletePostHandler = async (event) => {
    console.log("you entered into delete ajax.");
    try {
      event.preventDefault();
      const button = $(event.currentTarget);
      const postId = button.data("id");
      const postElement = $("#post-" + postId);
      let deleteReq = {
        method: "POST",
        url: `/post/${postId}/delete`,
        contentType: "application/json",
        data: JSON.stringify({
          id: postId,
        }),
      };
      $.ajax(deleteReq).then(function (responseMessage) {
        console.log(responseMessage);
        console.log(postElement);
        if (responseMessage.success) {
          postElement.remove();
          button.remove();
        }
        // Display a success message at the top of the page
        const message = $("<div>")
          .addClass("alert alert-success")
          .text("Post deleted successfully");
        $("body").prepend(message);

        // Remove the message after 5 seconds
        setTimeout(function () {
          message.remove();
        }, 5000);
      });
    } catch (error) {
      console.error(error);
    }
  };
  $(".deletePostbtn").on("click", deletePostHandler);
})(window.jQuery);

if (imgInput) {
  imgInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    errorDiv.hidden = true;
    let error;
    if (!validateImage(file)) {
      imgInput.value = ""; // clear the input field
      console.log(file);
      error = "Only jpg/png/jpeg file types are allowed";
    }
    if (error) {
      errorDiv.hidden = false;
      errorDiv.textContent = error;
      window.history.replaceState({}, document.title, "?status=400");
    } else {
      let reader = new FileReader();
      reader.readAsDataURL(imgInput.files[0]);
      reader.addEventListener("load", () => {
        if (reader.result) {
          img.src = reader.result;
        }
      });
      reader.addEventListener("error", () => {
        console.error("Error reading file:", reader.error);
      });
    }
  });
}
const validateImage = (file) => {
  const allowedTypes = ["image/jpeg", "image/png"];

  if (!allowedTypes.includes(file.type)) {
    // the file is not a JPG or PNG image
    return false;
  }

  return true;
};

const checkTitle = (title) => {
  checkvalid(title, "title");
  if (typeof title != "string") throw "Title must be a string";
  title = title.trim();
  if (title.length > 200) throw "Title must be no more than 200 characters";
  if (title.trim() === "") throw "Title must be supplied!";
};

const checkDescription = (description) => {
  checkvalid(description, "description");
  if (typeof description !== "string") throw "description must be a string";
  description = description.trim();
  if (description.trim() === "") throw "description must not be empty";
  if (description.length > 2500)
    throw "description must no more than 2500 characters";
};

const checkbudget = (budget) => {
  if (!budget) throw "no budget provided";
  budget = parseInt(budget);
  if (typeof budget !== "number") throw "budget should be a valid number"; // it was allowing NaN's
  if (!budget) throw "budget can only be in numbers!"; // so had to add this
  if (budget <= 0) throw "Budget can not be a negative number!";
};

const createPostForm = document.getElementById("create-post-form");
const title = document.getElementById("titleInput");
const description = document.getElementById("descriptionInput");
const budgetInput = document.getElementById("budgetInput");
if (budgetInput) {
  budgetInput.addEventListener("input", (event) => {
    let inputValue = event.target.value;
    inputValue = inputValue.replace(/[^0-9]/g, ""); // replace non-numeric characters with empty string
    event.target.value = inputValue;
  });
}
if (createPostForm) {
  createPostForm.addEventListener("submit", (event) => {
    event.preventDefault();
    errorDiv.hidden = true;
    let error;
    try {
      if (!imgInput.files[0]) {
        throw "image is required field";
      }
      checkTitle(title.value);
      checkDescription(description.value);
      checkbudget(budgetInput.value);
      if (!divDataInput.value.trim()) {
        throw "Category is not provided, please select at least one";
      }
      checkzipcode(zip.value);
      checkcity(city.value);
      checkstate(state.value);
      console.log("pass the error check");
    } catch (e) {
      error = e;
    }

    if (error) {
      errorDiv.hidden = false;
      errorDiv.textContent = error;
      window.history.replaceState({}, document.title, "?status=400");
    } else {
      createPostForm.submit();
    }
  });
}

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
    try {
      checkfirstname(firstname.value);
      checklastname(lastname.value);
      checkemail(emailaddress.value);
      // console.log(phone.value);
      checkphone(phone.value);
      checkpassword(password.value);
      checkpassword(confirmpassword.value);
      checkrole(role.value);

      checkAge();
      if (password.value !== confirmpassword.value) {
        // console.log(password.value);
        error = "Passwords is not matched";
      }
    } catch (e) {
      error = e;
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
  "Web Developer",
  "Tutoring/Training",
  "Creative",
  "Photography",
  "Music",
  "Restaurant",
  "Recreation",
  "Event Planning",
  "Home Services",
  "Dog Walker",
  "Pet Services",
  "Book Keeper",
  "Christmas Tree Decorator",
  "Interior Design",
  "Culinary",
  "Other",
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
const addintohiddendiv = () => {
  const AllName = document.querySelectorAll(".category-name");
  let newarr = [];
  if (!AllName == 0) {
    AllName.forEach((element) => {
      newarr.push(element.textContent); // Get data from div tags and store in array
      // console.log("--------" + newarr);
    });
    let newarrstr = newarr.join(",");
    newarr = newarrstr.split(",").map((s) => s.trim().replace(/"/g, ""));
  } else {
    newarr = [];
  }
  // Set hidden input field value to the data array
  for (let i in newarr)
    if (newarr[i] !== "") {
      // console.log(newarr[i]);
      divDataInput.value = newarr;
      // if (!categories.includes(categories[i])) {
      //   divDataInput.value += `"${categories[i]}",`;
      // }
      // console.log(newarr);
    }
};

const deleteButtons = document.querySelectorAll(".delete-button");
if (deleteButtons) {
  deleteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // get the parent div element and remove it from the DOM
      button.parentNode.remove();
    });
    button.addEventListener("click", addintohiddendiv);
  });
}
const mainbox = document.getElementById("category-container");
if (mainbox) {
  mainbox.addEventListener("change", addintohiddendiv);
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
            addintohiddendiv();
          });
          divBox.appendChild(spanDelete);
          const categoryContainer = document.querySelector(
            ".category-container"
          );
          categoryContainer.appendChild(divBox);
          categoryInput.value = ""; // clear the input field
          addintohiddendiv();
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

if (document.getElementById("send-btn")) {
  document.getElementById("send-btn").addEventListener("click", function () {
    const messageStatus = document.getElementById("message-status");
    messageStatus.innerText = "Message sent successfully!";
    messageStatus.style.display = "block";
    setTimeout(function () {
      messageStatus.style.display = "none";
    }, 3000);
  });
}

var dmForm = document.getElementById("dm-form");
dmForm.addEventListener("submit", function (e) {
  e.preventDefault();
  var dmInput = document.getElementById("dm-input");
  var recId = document.getElementById("recId");
  var error = document.getElementById("dmError");
  var errors = [];
  if (dmInput.value == "") {
    errors.push("Please enter a message");
  }
  if(dmInput.value.trim() == ""){
    errors.push("Please enter a valid message");
  }
  if (recId.value.trim() == "") {
    errors.push("Please enter a valid recipient");
  }
  if (errors.length > 0) {
    error.innerText = errors.join(", ");
    error.style.display = "block";
    // showing the error only for 1.5 seconds.
    setTimeout(function () {
      error.style.display = "none";
    }, 1500);
  } 
});
const profileForm = document.getElementById("add-review-form");
if (profileForm) {
  profileForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const reviewInput = document.getElementById("reviewInput");
    const profileError = document.getElementById("profileError");
    const ratingInput = document.getElementById("ratingInput");
    const errors = [];
    if (reviewInput.value.trim() == "") {
      errors.push("Please enter a valid review");
    }
    if (ratingInput.value.trim() == "") {
      errors.push("Please enter a valid rating");
    }
    if (errors.length > 0) {
      profileError.innerText = errors.join(", ");
      profileError.style.display = "block";
      // showing the error only for 1.5 seconds.
      setTimeout(function () {
        profileError.style.display = "none";
      }, 1500);
    } else {
      profileForm.submit();
    }
  });
}

const filterFrom = document.getElementById("filter-form");
if (filterFrom) {
  filterFrom.addEventListener("submit", function (e) {
    e.preventDefault();
    const filterError = document.getElementById("filterError");
    const filterInput = document.getElementById("searchAreaInput");
    const errors = [];
    if(filterInput.value.trim() == ""){
      errors.push("Please enter a valid search area");
    }
    if (errors.length > 0) {
      filterError.innerText = errors.join(", ");
      filterError.style.display = "block";
      // showing the error only for 1.5 seconds.
      setTimeout(function () {
        filterError.style.display = "none";
      }, 1500);
    } else {
      filterFrom.submit();
    }
  });
}

const reviewsForm = document.getElementById("edit-review-form");
if (reviewsForm) {
  reviewsForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const reviewInput = document.getElementById("editratingInput");
    const profileError = document.getElementById("reviewsError");
    const ratingInput = document.getElementById("editreviewInput");
    const errors = [];
    if (reviewInput.value.trim() == "") {
      errors.push("Please enter a valid review");
    }
    if (ratingInput.value.trim() == "") {
      errors.push("Please enter a valid rating");
    }
    if (errors.length > 0) {
      profileError.innerText = errors.join(", ");
      profileError.style.display = "block";
      // showing the error only for 1.5 seconds.
      setTimeout(function () {
        profileError.style.display = "none";
      }, 1500);
    } else {
      reviewsForm.submit();
    }
  });
}


window.addEventListener("change", addintohiddendiv); // on window change anything
