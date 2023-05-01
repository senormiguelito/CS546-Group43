import { Router } from "express";
const router = Router();
import * as h from "../helpers.js";
import * as usersdata from "../data/users.js";

router.route("/").get(async (req, res) => {
  try {
    res.render("home", { title: "Homepage" });
  } catch (e) {
    res.status(400).render("home", { Error: e });
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
          const message = `Hurrey, ${userName} you have registered successfully.`;
          res.render("login", { title: "Login", Message: message });
        }
      }
      res.status(200).render("login", { title: "Login" });
      req.session.user = { justRegistered: false };
    } catch (e) {
      res.status(400).render("login", { Error: e });
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
      res.status(400).render("login", { error: e });
    }
    try {
      const loginDetails = await usersdata.checkUser(emailAddress, password);
      if (loginDetails.authentication) {
        req.session.user = {
          firstName: loginDetails.firstName,
          lastName: loginDetails.lastName,
          emailAddress: loginDetails.emailAddress,
          role: loginDetails.role,
          authentication: true,
        };
        if (
          loginDetails.role === "provider" ||
          loginDetails.role === "seeker"
        ) {
          res.redirect("/");
        }
      } else {
        res
          .status(400)
          .render("login", { Error: "sorry, user not authenticate" });
      }
    } catch (e) {
      // console.log(e);
      res.status(400).render("login", { Error: e });
    }
  });

router
  .route("/signup")
  .get(async (req, res) => {
    try {
      if (req.session.user) {
        req.session.user = { justRegistered: false };
      }
      res.render("sign-up", { title: "Registration" });
    } catch (e) {
      res.send(400).render("sign-up", { title: "Registration", Error: e });
    }
  })
  .post(async (req, res) => {
    //code here for POST
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
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

    // console.log("this is check 1");
    try {
      h.checkfirstname(firstName);
      h.checklastname(lastName);
      h.checkemail(emailAddress);
      h.checkphone(phone);
      h.checkpassword(password);
      h.checkpassword(confirmpassword);
      h.checkrole(role);
      h.checkcity(city);
      h.checkstate(state);
      h.checkzip(zip);
      // h.checkzip();
    } catch (e) {
      // console.log("this is data user file", e);
      res.status(400).render("sign-up", { error: e, title: "Registration" });
    }
    try {
      let CreatedUser = await usersdata.create(
        firstName,
        lastName,
        emailAddress,
        phone,
        password,
        role,
        zip,
        city,
        state
      );
      // console.log(CreatedUser.insertedUser);
      if (CreatedUser.insertedUser) {
        req.session.user = {
          firstName: firstName,
          emailAddress: emailAddress,
          justRegistered: true,
        };
        res.status(200).redirect("/user/login");
      } else {
        res.status(500).render("login", { Error: "Internal Server Error" });
      }
    } catch (e) {
      res.status(400).render("sign-up", { error: e, title: "Registration" });
    }
  });

export default router;
