import { postData } from "../data/index.js";
import { userData } from "../data/index.js";
import { Router } from "express";
import { messageData } from "../data/index.js";
const router = Router();

router.route("/").get(async (req, res) => {
  try {
    let posts = await postData.getAll();
    // console.log(posts.title, posts.description)
    // console.log(posts)
    let message = "";
    if (req.session.user) {
      const userSession = req.session.user.userSessionData;
      message = `Hey ${userSession.firstName}, this is your user ID: ${req.session.user.userID}`;
    } else {
      message = `hey you entered without login!!!, how???`;
      res.redirect("/login"); // talk with Kaushal for clarification
    }

    res.render("home", { posts: posts, Message: message });
  } catch (e) {
    return res.status(400).render("home", { error: e });
  }
});

router.route("/myprofile").get(async (req, res) => {
  const sessionObj = req.session.user.userSessionData;
  const userID = req.session.user.userID;

  res.render("myprofile", { title: "Profile", userID, sessionObj });
});

router.route("/provideList").get(async (req, res) => {
  try {
    const userList = await userData.getUsersByRole("provider");
    // console.log(userList)
    res.render("providerlist", { userList: userList });
  } catch (e) {
    res.render("providerlist", { error: e });
    // return res.status(400).render("error", { error: e });
  }
});

router
  .route("/myprofile/:id/edit")
  .get(async (req, res) => {
    try {
      const userID = req.session.user.userID;
      const user = await userData.getUser(userID);
      const sessionObj = req.session.user.userSessionData;
      if (user) {
        res.render("editProfile", {
          title: `${user.firstName + user.lastName}`,
          userID,
          sessionObj,
        });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })
  .post(async (req, res) => {
    try {
      const firstName = req.body.firstName;
      const lastName = req.body.lastName;
      const bio = req.body.bio;
      const DOB = req.body.dob;
      const emailAddress = req.body.email;
      const phone = req.body.phoneNumber;
      // const password = req.body.password;   if we want to allow user to change password we can but for right now i am comment this password thing.
      // const confirmpassword = req.body.confirmPassword;
      const zip = req.body.zip;
      const city = req.body.city;
      const state = req.body.state;
      const catagories = req.body.catagories;
      console.log(categories);
      const profileUpdated = await userData.update(
        req.params.id,
        playgroundName,
        schedule,
        amenities,
        playgroundSize,
        location
      );
      if (profileUpdated) {
        res.redirect("/");
      } else {
        res
          .status(500)
          .render("editprofile", { Errro: "Not able to save changes!!" });
      }
    } catch (e) {
      return res.status(400).render("editProfile", { error: e });
    }
  });

// router.route("/seekers").get(async (req, res) => {
//   try {
//     const userList = await userData.getUsersByRole("seeker");
//     // console.log(userList)
//     res.render("seekerList", { userList: userList });
//   } catch (e) {
//     res.render("seekerList", { error: e });
//     // return res.status(400).render("error", { error: e });
//   }
// });

router
  .route("/messages")
  .get(async (req, res) => {
    const userSession = req.session.user.userSessionData;
    // console.log(userSession)
    try {
      const messages = await messageData.getMessages(userSession._id);
      // console.log(messages);

      res.render("dmList", { title: "messages", messages: messages });
    } catch (e) {
      console.log(e);
      // return res.status(400).render("error", { error: e });
    }
    // const messages = await messageData.getMessages(userSession._id);
    // console.log(messages);
    // res.render("dmList", { title: "messages", messages: messages });
  })
  .post(async (req, res) => {
    const userSession = req.session.user.userSessionData;
    const sender = userSession._id;
    const reciever = req.body.reciever;
    const message = req.body.message;
    try {
      const newMessage = await messageData.sendMessage(
        sender,
        reciever,
        message
      );
      // res.redirect("/messages");
      console.log("message sent");
    } catch (e) {
      console.log(e);
      // return res.status(400).render("error", { error: e });
    }
  });

// moved the following and implemented in /users.js:

// router.route("/profile/:userId").get(async (req, res) => {
//   // access a profile page
//   let errorMessage = '';
//   try {
//     if (req.session.user) {
//       const userId = userSessionData._id.toString();
//       const userID = req.params.userId;               // pick this or the above
//       const user = await userData.getUser(userId);
//       res.render('profile', { user });
//     } else {
//       res.redirect('/login');   // must be logged in to interact with posts
//     }
//   } catch (e) {
//     console.log(e);
//     res.status(500).render('error', { errorMessage: "Internal Server Error" });

//   }
// });

export default router;
