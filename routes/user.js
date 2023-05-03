import { Router } from "express";
const router = Router();
import * as h from "../helpers.js";
import { userData } from "../data/index.js";

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
          const message = `Hurray! ${userName} you have registered successfully.`;
          res.render("login", {
            isHide: true,
            title: "Login",
            Message: message,
          });
        }
        if (req.session.user.justRegistered) {
          req.session.destroy();
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
    const emailAddress = req.body.emailAddressInput;
    const password = req.body.passwordInput;
    try {
      h.checkemail(emailAddress);
      h.checkpassword(password);
    } catch (e) {
      res
        .status(400)
        .render("login", { Error: e, layout: "main", isHide: true });
    }
    try {
      const loginDetails = await userData.checkUser(emailAddress, password);
      if (loginDetails) {
        if (loginDetails.authentication) {
          req.session.user = {
            userID: loginDetails.userId, // --> here I am sending user's Object Id converted into string data into session.
            firstName: loginDetails.firstName,
            lastName: loginDetails.lastName,
            emailAddress: loginDetails.emailAddress,
            role: loginDetails.role,
            authentication: true,
          };
          res.redirect("/home/myprofile");
        }
      } else {
        res.status(400).render("login", {
          Error: "sorry, user not authenticated",
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
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const DOB = req.body.dob;
    const emailAddress = req.body.email;
    // console.log(req.body.phoneNumber);
    const phone = req.body.phoneNumber;
    // console.log(phone);
    const password = req.body.password;
    const confirmpassword = req.body.confirmPassword;
    const role = req.body.role;
    const zip = req.body.zip;
    const city = req.body.city;
    const state = req.body.state;
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
    res.status(200).redirect("/");
  } catch (e) {
    res.status(400).render("error", { Error: e });
  }
});

export default router;
