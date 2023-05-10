import { Router } from "express";
const router = Router();
import * as h from "../helpers.js";
import { userData } from "../data/index.js";
import { postData } from "../data/index.js";

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
          return res.render("login", {
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
      return res.status(400).render("login", {
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

          req.session.user = {
            userID: userId, // --> here I am sending user's Object Id converted into string data into session.
            userSessionData,
            authentication: true,
          };
          return res.redirect("/home/myprofile"); // nice!
        }
      } else {
        return res.status(400).render("login", {
          Error: "sorry, you are not authenticated",
          layout: "main",
          isHide: true,
        });
      }
    } catch (e) {
      // console.log(e);
      return res.status(400).render("login", { Error: e, isHide: true });
    }
  });

router
  .route("/signup")
  .get(async (req, res) => {
    try {
      if (req.session.user) {
        req.session.user = { justRegistered: false };
      }
      return res.render("sign-up", { title: "Registration", isHide: true });
    } catch (e) {
      return res
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
    const phone = xss(req.body.phoneNumber);
    const password = xss(req.body.password);
    const confirmpassword = xss(req.body.confirmPassword);
    const role = xss(req.body.role);
    const zip = xss(req.body.zip);
    const city = xss(req.body.city);
    const state = xss(req.body.state);
    try {
      h.checkfirstname(firstName);
      h.checklastname(lastName);
      h.checkDOB(DOB);
      h.checkemail(emailAddress);
      h.checkphone(phone);
      h.checkpassword(password);
      h.checkpassword(confirmpassword);
      h.checkrole(role);
      h.checkcity(city);
      h.checkstate(state);
      h.checkzipcode(zip);

      let newUser = await userData.create(
        firstName,
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
      if (newUser.insertedUser) {
        req.session.user = {
          firstName: firstName,
          emailAddress: emailAddress,
          justRegistered: true,
        };
        return res.status(200).redirect("/login");
      } else {
        return res
          .status(500)
          .render("login", { Error: "Internal Server Error", isHide: true });
      }
    } catch (e) {
      return res
        .status(400)
        .render("sign-up", { Error: e, title: "Registration", isHide: true });
    }
  });

router.route("/logout").get(async (req, res) => {
  //code here for GET
  try {
    req.session.destroy();
    return res.status(200).redirect("/"); // add a message to confirm that you have been logged out
  } catch (e) {
    return res.status(400).render("error", { Error: e });
  }
});

router.route("/seekers").get(async (req, res) => {
  try {
    const userList = await userData.getUsersBy("seeker");
    if (!userList) throw new Error("could not find any user");

    res.render("seekerList", { userList: userList });
  } catch (e) {
    return res.render("seekerList", { error: e });
    // return res.status(400).render("error", { error: e });
  }
});

router.route("/seekers/sortBy").post(async (req, res) => {
  try {

    let user = req.session.user.userSessionData;
    let filterBy = xss(req.body.filter);      // wrapped in xss
    let userList = undefined;
    if (filterBy.toLowerCase() === "distance") {
      userList = await userData.sortSeekersByDistance(user);
      if (!userList) throw new Error("error sorting by distance");
    }
    if (filterBy.toLowerCase() === "rating") {
      userList = await userData.sortSeekerByRating();
    }
    if (filterBy.toLowerCase() === "all") {
      userList = await userData.getUsersBy("seeker");
      console.log(userList);
    }
    // const userList = await userData.getUsersByRole("provider");
    // console.log(userList)
    return res.status(200).render("seekerlist", { userList: userList });
  } catch (e) {
    return res.status(400).render("seekerlist", { error: e });

  }
});

router.route("/seekers/searchArea").put(async (req, res) => {
  try {
    let user = req.session.user.userSessionData;
    let searchArea = xss(req.body.searchAreaInput);
    let userList = await userData.filterSeekerBySearchArea(user, searchArea);
    if (!userList) throw new Error("No user in that search area");
    // const userList = await userData.getUsersByRole("provider");
    // console.log(userList)
    return res.status(200).render("seekerlist", { userList: userList });

  } catch (e) {
    return res.status(400).render("seekerlist", { error: e });

  }
});
router.route("/profile/:userId").get(async (req, res) => {
  // access a profile page
  const userId = req.params.userId;
  // console.log(userId);

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


      let currentUserId = req.session.user.userID.toString();
      currentUserId = currentUserId.trim();

      if (!user) throw new Error("User profile was not found");

      if (currentUserId === profileToAccessById) {
        //if this user clicks on view profile and its their profile:
        return res.redirect("/home/myprofile");
      }
      return res.status(200).render("profile", { title: "Profile", user: user });

    } else {
      return res.redirect("/login"); 
    }
  } catch (e) {
    return res.status(400).render("error", { error: e });
  }
});

router.route("/comment/profile/:commentId").get(async (req, res) => {
  // access a profile page
  try {
    const commentId = req.params.commentId;
    const post = await postData.getByCommentId(commentId);

    if (!post) throw new Error("No post was found with that commentId");
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
          return res.status(200).render("profile", { title: "Profile", user: user });
        }
      } else {
        return res.redirect("/login"); 
      }
    } catch (e) {
      return res.status(404).render("error", { error: e });
    }
  } catch (e) {
    return res.status(404).render("error", { error: e });
  }
});

export default router;
