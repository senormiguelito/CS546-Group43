import { postData } from "../data/index.js";
import { userData } from "../data/index.js";
import { Router } from "express";
import { messageData } from "../data/index.js";
import multer from "multer";
const router = Router();

router.route("/").get(async (req, res) => {
  try {
    // let posts = await postData.getAll();
    // console.log(posts.title, posts.description)
    let role = req.session.user.userSessionData.role
    // console.log()
    if(!role) throw 'YO! how come you logged in without providing role?'
    let message = "";
    if (req.session.user) {
      const userSession = req.session.user.userSessionData;
      message = `Hey ${userSession.firstName}, this is your user ID: ${req.session.user.userID}`;
    } else {
      message = `hey you entered without login!!!, how???`;
      res.redirect("/login"); // talk with Kaushal for clarification
    }
    let posts = undefined
    if(role === 'seeker') {
      posts = await postData.getByRole("provider")
    }
    if(role === 'provider') {
      posts = await postData.getByRole("seeker")
    }
    if(!posts) throw 'OOPS! could not find posts!'
    res.render("home", { posts: posts, Message: message });
  } catch (e) {
    return res.status(400).render("home", { error: e });
  }
});

router.route("/myprofile").get(async (req, res) => {
  const userID = req.session.user.userID;
  const user = await userData.getUser(userID);
  req.session.user = { userID: userID, userSessionData: user };
  const objectUser = req.session.user.userSessionData;
  res.render("myprofile", { title: "Profile", userID, objectUser });
});

router.route("/provideList").get(async (req, res) => {
  try {
    const userList = await userData.getUsersByRole("provider");
    // console.log(userList)
    res.status(200).render("providerlist", { userList: userList });
  } catch (e) {
    res.status(400).render("providerlist", { error: e });
    // return res.status(400).render("error", { error: e });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + ".jpg");
  },
});

const upload = multer({ storage: storage });

router
  .route("/myprofile/:id/edit")
  .get(async (req, res) => {
    try {
      const userID = req.session.user.userID;
      const user = await userData.getUser(userID);
      // req.session.user = { userID: userID, userSessionData: user };//just to update session if user updated
      const objectUser = req.session.user.userSessionData;
      let notnull = true;
      if (objectUser.categories.length > 0) {
        const checkcat = objectUser.categories;
        for (const a in checkcat) {
          if (checkcat[a] == "") {
            notnull = false;
          }
        }
      }
      if (user) {
        res.render("editProfile", {
          title: `${user.firstName + user.lastName}`,
          userID,
          objectUser,
          notnull,
        });
      }
    } catch (e) {
      res.status(400).render("editprofile", {
        Error: e,
        userID,
        sessionObj,
      });
    }
  })
  .post(upload.single("image"), async (req, res) => {
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
      const categories = req.body.categorydata;
      const imageData =
        "http://localhost:3000/public/images/" + req.file.filename;
      console.log(imageData);
      const arrCategories = categories
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/"/g, ""));
      // console.log(arr);
      // console.log(Array.isArray(arr));
      // console.log(typeof arr);

      const profileUpdated = await userData.update(
        req.session.user.userID,
        firstName,
        lastName,
        emailAddress,
        DOB,
        phone,
        city,
        state,
        zip,
        arrCategories,
        bio,
        imageData
      );
      if (profileUpdated) {
        const userID = req.session.user.userID;
        const objectUser = req.session.user.userSessionData;
        res.status(500).render("editprofile", {
          title: "Edit Profile",
          Message: "Updated successfully.",
          userID,
          objectUser,
        });
        if (profileUpdated.notchanged) {
          const userID = req.session.user.userID;
          const objectUser = req.session.user.userSessionData;
          res.status(500).render("editprofile", {
            title: "Edit Profile",
            Message: "Not anything changed",
            userID,
            objectUser,
          });
        }
      } else {
        const userID = req.session.user.userID;
        const objectUser = req.session.user.userSessionData;
        res.status(500).render("editprofile", {
          Errro: "Not able to save changes!!",
          userID,
          objectUser,
        });
      }
    } catch (e) {
      const userID = req.session.user.userID;
      const objectUser = req.session.user.userSessionData;
      return res.status(400).render("editProfile", {
        Error: e,
        userID,
        objectUser,
      });
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
      let messages = await messageData.getMessages(userSession._id);
      for (let i = 0; i < messages.length; i++) {
        if (messages[i].senderId == userSession._id) {
          messages[i].sender = true;
        } else {
          messages[i].sender = false;
        }
      }

      console.log(messages);

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
    const reciever = req.body.recieverId;
    const message = req.body.message;
    try {
      const newMessage = await messageData.sendMessage(
        sender,
        reciever,
        message
      );
      // res.redirect("/messages");
      // return res.status(200).json({ message: "Message sent successfully" });
      return res.redirect("/home/messages");
    } catch (e) {
      console.log(e);
      return res.status(400).render("error", { error: e });
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
