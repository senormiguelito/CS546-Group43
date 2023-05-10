import { Router } from "express";
const router = Router();
import * as h from "../helpers.js";
import { userData } from "../data/index.js";
import { postData } from "../data/index.js";
import { reviewData } from "../data/index.js";
import xss from "xss";

router.route("/").get(async (req, res) => {
  if (req.session.user) {
    return res.redirect("/home");
  } else {
    return res.redirect("/login");
  }
});

router
  .route("/login")
  .get(async (req, res) => {
    try {
      if (req.session.user) {
        const checkregister = req.session.user.justRegistered;
        if (checkregister) {
          const userName = req.session.user.firstName;
          const message = `Hurray! ${userName}, you have registered successfully! Please log in to access our website.`;
          res.render("login", {
            isHide: true,
            title: "Login",
            Message: message,
          });
        }
        if (req.session.user.justRegistered) {
          req.session.destroy();
          req.session.user = { allowtoRegister: true };
        }
      } else {
        res
          .status(200)
          .render("login", { title: "Login", layout: "main", isHide: true });
        // (this above line is needed, if you don't put this line, it will never render anything, page will load infinite, when there is session but
        // not registered so it will not going to throw any error so no catch(e), so your website will be loading but never render login page.)
      }
    } catch (e) {
      res.status(400).render("login", {
        Error: e,
        layout: "main",
        isLoginPage: false,
        isHide: true,
      });
    }
  })
  .post(async (req, res) => {
    //code here for POST
    const emailAddress = xss(req.body.emailAddressInput);
    const password = xss(req.body.passwordInput);
    try {
      h.checkemail(emailAddress);
      h.checkpassword(password);

      const loginDetails = await userData.checkUser(emailAddress, password);
      if (loginDetails) {
        if (loginDetails.authentication) {
          const userSessionData = loginDetails.thisUser;
          const userId = userSessionData._id.toString();
          // console.log(userId);
          req.session.user = {
            userID: userId, // --> here I am sending user's Object Id converted into string data into session.
            userSessionData,
            authentication: true,
          };
          res.redirect("/home/myprofile"); // nice!
        }
      } else {
        res.status(400).render("login", {
          Error: "sorry, you are not authenticated",
          layout: "main",
          isHide: true,
        });
      }
    } catch (e) {
      // console.log(e);
      res.status(400).render("login", { Error: e, isHide: true });
    }
  });

router
  .route("/signup")
  .get(async (req, res) => {
    try {
      if (req.session.user) {
        req.session.user = { justRegistered: false };
      }
      res.render("sign-up", { title: "Registration", isHide: true });
    } catch (e) {
      res
        .send(400)
        .render("sign-up", { title: "Registration", Error: e, isHide: true });
    }
  })
  .post(async (req, res) => {
    //code here for POST
    const firstName = xss(req.body.firstName);
    const lastName = xss(req.body.lastName);
    const DOB = xss(req.body.dob);
    const emailAddress = xss(req.body.email);
    // console.log(req.body.phoneNumber);
    const phone = xss(req.body.phoneNumber);
    // console.log(phone);
    const password = xss(req.body.password);
    const confirmpassword = xss(req.body.confirmPassword);
    const role = xss(req.body.role);
    const zip = xss(req.body.zip);
    const city = xss(req.body.city);
    const state = xss(req.body.state);
    // console.log("harshil", phone + "-" + firstName);
    try {
      h.checkfirstname(firstName);
      h.checklastname(lastName);
      h.checkDOB(DOB); // important check //please if you change anything please check it twise that it is working or not, h.checkDOB(date_of_birth); is never gonna work here.
      h.checkemail(emailAddress);
      h.checkphone(phone);
      h.checkpassword(password);
      h.checkpassword(confirmpassword);
      h.checkrole(role);
      h.checkcity(city);
      h.checkstate(state);
      h.checkzipcode(zip);

      let newUser = await userData.create(
        firstName, // here order is matter, so don't change anything random if you want to send dob in create function then it should be after lastname only. or you have to change the order in create function in users.js data file
        lastName,
        DOB,
        emailAddress,
        phone,
        password,
        role,
        zip,
        city,
        state
      );
      // console.log(CreatedUser.insertedUser);
      if (newUser.insertedUser) {
        req.session.user = {
          firstName: firstName,
          emailAddress: emailAddress,
          justRegistered: true,
        };
        res.status(200).redirect("/login");
      } else {
        res
          .status(500)
          .render("login", { Error: "Internal Server Error", isHide: true });
      }
    } catch (e) {
      res
        .status(400)
        .render("sign-up", { Error: e, title: "Registration", isHide: true });
    }
  });

// router.route("/error").get(async (req, res) => {
//   res.status(403).render("error", {
//     title: "Error",
//     message: "there is an error, Check your internet connection.",
//   });
// });

router.route("/logout").get(async (req, res) => {
  //code here for GET
  try {
    req.session.destroy();
    res.status(200).redirect("/"); // add a message to confirm that you have been logged out
  } catch (e) {
    res.status(400).render("error", { Error: e });
  }
});

router.route("/seekers").get(async (req, res) => {
  try {
    // console.log("in seeker")
    const userList = await userData.getUsersBy("seeker");
    if(!userList) throw new Error("could not find any user")
    // console.log(userList)
    res.render("seekerList", { userList: userList }); // handlebars [age]
  } catch (e) {
    res.render("seekerList", { error: e });
    // return res.status(400).render("error", { error: e });
  }
});

router.route("/seekers/sortBy").post(async (req, res) => {
  try {
    // console.log("in seekersList filter route")
    // console.log(req.params,req.body)
    let user = req.session.user.userSessionData;
    let filterBy = xss(req.body.filter);
    let userList = undefined;
    if (filterBy.toLowerCase() === "distance") {
      userList = await userData.sortSeekersByDistance(user);
    }
    if(filterBy.toLowerCase() === "rating"){
      userList = await userData.sortSeekerByRating()
    }
    if(filterBy.toLowerCase() === "all"){
      userList = await userData.getUsersBy("seeker");
      console.log(userList)
    }
    // const userList = await userData.getUsersByRole("provider");
    // console.log(userList)
    res.status(200).render("seekerlist", { userList: userList });
  } catch (e) {
    res.status(400).render("seekerlist", { error: e });
    // return res.status(400).render("error", { error: e });
  }
});

router.route("/seekers/searchArea").post(async (req, res) => {
  try {
    // console.log("in seekersList filter route")
    // console.log(req.params,req.body)
    let user = req.session.user.userSessionData;
    let searchArea = xss(req.body.searchAreaInput);
    searchArea = parseInt(searchArea)
    let userList = await userData.filterSeekerBySearchArea(user, searchArea);

    res.status(200).render("seekerlist", { userList: userList });
  } catch (e) {
    res.status(400).render("seekerlist", { error: e });
    // return res.status(400).render("error", { error: e });
  }
});
router.route("/profile/:userId").get(async (req, res) => {
  // access a profile page

  const userId = req.params.userId;
  console.log(userId);

  try {
    if (!userId) throw new Error("no userId specified");
    h.checkId(userId);
  } catch (e) {
    return res.status(400).redirect("/home");
  }
  try {
    if (req.session.user) {
      const user = await userData.getUser(userId);
      let profileToAccessById = user._id.toString();
      profileToAccessById = profileToAccessById.trim();

      // console.log(req.session.user.userID.toString());
      // console.log(req.session.user.userSessionData._id.toString());

      let currentUserId = req.session.user.userID.toString();
      currentUserId = currentUserId.trim();

      if (!user) throw new Error("User profile was not found");

      if (currentUserId === profileToAccessById) {
        //if this user clicks on view profile and its their profile:
        return res.redirect("/home/myprofile");
      }
      res.status(200).render("profile", { title: "Profile", user: user });
      // res.status(200).render('profile', { user: user });    // now we can see just what tha hell is goin on
    } else {
      res.redirect("/login"); // must be logged in to interact with posts
    }
  } catch (e) {
    return res.status(404).render("error", { error: e });
  }
});

router.route("/comment/profile/:commentId").get(async (req, res) => {
  // access a profile page
  try {
    const commentId = req.params.commentId;
    const post = await postData.getByCommentId(commentId);
    // console.log("req.session.user:");
    // console.log(req.session.user);

    let userId = undefined;
    post.comments.forEach((element) => {
      if (element._id.toString() === commentId) {
        userId = element.userId;
      }
    });

    try {
      if (!userId) throw new Error("no userId specified");

      h.checkId(userId);
    } catch (e) {
      return res.status(400).redirect("/home");
    }
    try {
      if (req.session.user) {
        let user = await userData.getUser(userId); // user who posted the comment
        if (!user) throw new Error("no userId specified");
        user._id = user._id.toString();

        let currentUserId = req.session.user.userID;
        currentUserId = currentUserId.trim();

        if (currentUserId === userId) {
          //if this user clicks on view profile and its their profile:
          return res.redirect("/home/myprofile");
        } else {
          console.log("lets NOT go home");
          res.status(200).render("profile", { title: "Profile", user: user });
        }
      } else {
        res.redirect("/login"); // must be logged in to interact with posts
      }
    } catch (e) {
      return res.status(404).render("error", { error: e });
    }
  } catch (e) {
    return res.status(404).render("error", { error: e });
  }
});

export default router;
