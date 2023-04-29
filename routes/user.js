import { Router } from "express";
const router = Router();
import * as h from "../helpers.js";
import * as usersdata from "../data/users.js";

router.route("/user").get(async (req, res) => {
  try {
    res.render("home", { title: "Homepage" });
  } catch (e) {
    res.sendStatus(500).redirect("/error");
  }
});

router
  .route("/login")
  .get(async (req, res) => {
    try {
      res.render("login", { title: "Login" });
    } catch (e) {
      res.sendStatus(500).redirect("/user");
    }
  })
  .post(async (req, res) => {
    //code here for POST
  });

router
  .route("/signup")
  .get(async (req, res) => {
    try {
      res.render("sign-up", { title: "Registration" });
    } catch (e) {
      res.sendStatus(500).redirect("/home");
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
      const requiredFields = [
        "firstName",
        "email",
        "phoneNumber",
        "password",
        "confirmPassword",
        "role",
        "zip",
        "city",
        "state",
      ];
      const missingFields = requiredFields.filter((field) => !req.body[field]);
      if (missingFields.length > 0) {
        const errorMessage = `Please provide the following required fields: ${missingFields.join(
          ", "
        )}`;
        return res.status(400).render("sign-up", { error: errorMessage });
      }
      // console.log(firstName);
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
      console.log(e);
      return res
        .status(400)
        .render("sign-up", { error: e, title: "Registration" });
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
      if (CreatedUser.insertedUser) {
        res
          .status(200)
          .redirect("/login", { Message: "Registration successfully!!" });
      } else {
        res.status(500).render("login", { Error: "Internal Server Error" });
      }
    } catch (e) {
      return res
        .status(400)
        .render("sign-up", { error: e, title: "Registration" });
    }
  });

export default router;
