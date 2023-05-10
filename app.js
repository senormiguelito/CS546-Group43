import express from "express";
import configRoutes from "./routes/index.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import exphbs from "express-handlebars";
import session from "express-session";
import flash from "connect-flash";
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const staticDir = express.static(__dirname + "/public");

app.use("/public", staticDir);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "script-src 'self' cdn.jsdelivr.net ajax.googleapis.com kit.fontawesome.com/f7fb940881.js https://khan.github.io/tota11y/dist/tota11y.min.js 'unsafe-eval'"
  );
  next();
});

// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       "default-src": ["'self'"],
//       "script-src": [
//         "'self'",
//         "https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js",
//       ],
//     },
//   })
// );

app.use(flash());

app.use("/home", (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    return res.status(403).render("error", {
      title: "Error",
      unauthorizedAccess: true,
      isHide: true,
    });
  }
});

app.use("/posts", (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    return res.status(403).render("error", {
      title: "Error",
      unauthorizedAccess: true,
      isHide: true,
    });
  }
});

app.use("/home/providerList", (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    return res.status(403).render("error", {
      title: "Error",
      unauthorizedAccess: true,
      isHide: true,
    });
  }
});

app.use("/home/messages", (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    return res.status(403).render("error", {
      title: "Error",
      unauthorizedAccess: true,
      isHide: true,
    });
  }
});

app.use("/post/myPosts", (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    return res.status(403).render("error", {
      title: "Error",
      unauthorizedAccess: true,
      isHide: true,
    });
  }
});

app.use("/myProjects", (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    return res.status(403).render("error", {
      title: "Error",
      unauthorizedAccess: true,
      isHide: true,
    });
  }
});

app.use("/home/myprofile", (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    return res.status(403).render("error", {
      title: "Error",
      unauthorizedAccess: true,
      isHide: true,
    });
  }
});

app.use("/logout", (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    return res.status(403).render("error", {
      title: "Error",
      unauthorizedAccess: true,
      isHide: true,
    });
  }
});

app.use("/signup", (req, res, next) => {
  if (req.session.user) {
    if (req.session.user.allowtoRegister) {
      next();
    } else {
      return res.redirect("/home");
    }
  } else if (!req.session.user) {
    next();
  }
});

app.use("/login", (req, res, next) => {
  if (req.session.user) {
    if (req.session.user.justRegistered) {
      next();
    } else if (req.session.user.authentication) {
      return res.redirect("/home");
    } else if (req.session.user.userID) {
      return res.redirect("/home");
    }
  } else if (!req.session.user) {
    next();
  }
});

app.use("/seekers", (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    return res.status(403).render("error", {
      title: "Error",
      unauthorizedAccess: true,
      isHide: true,
    });
  }
});

app.use("/profile", (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    return res.status(403).render("error", {
      title: "Error",
      unauthorizedAccess: true,
      isHide: true,
    });
  }
});

app.use("/profile/:userId", (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    return res.status(403).render("error", {
      title: "Error",
      unauthorizedAccess: true,
      isHide: true,
    });
  }
});

app.use("/user/reviews/:userId", (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    return res.status(403).render("error", {
      title: "Forbidden",
      unauthorizedAccess: true,
      isHide: true,
    });
  }
});

app.use("/projects", (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    return res.status(403).render("error", {
      title: "Error",
      unauthorizedAccess: true,
      isHide: true,
    }); //it's so cool that we are using error page if user tries to access any routes without login.
    // return res.redirect("/login");
  }
});

app.use("/projects/:id", (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    return res.status(403).render("error", {
      title: "Error",
      unauthorizedAccess: true,
      isHide: true,
    }); //it's so cool that we are using error page if user tries to access any routes without login.
    // return res.redirect("/login");
  }
});

app.use("/api", (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    return res.status(403).render("error", {
      title: "Error",
      unauthorizedAccess: true,
      isHide: true,
    });
  }
});

app.use("/post", (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    return res.status(403).render("error", {
      title: "Error",
      unauthorizedAccess: true,
      isHide: true,
    });
  }
});

app.use("/post/newPost/createPost", (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    return res.status(403).render("error", {
      title: "Error",
      unauthorizedAccess: true,
      isHide: true,
    });
  }
});

app.use("/post/:postId/interested", (req, res, next) => {
  if (req.session.user) {
    if (req.method == "POST") {
      req.method = "PUT";
    }
    next();
  } else {
    return res.status(403).render("error", {
      title: "Error",
      unauthorizedAccess: true,
      isHide: true,
    });
  }
});

//please add your route name if you add any in futer, like /home/seekerpage/addpost
// app.use("/yournewroute", (req, res, next) => {
//   if (req.session.user) {
//     next();
//   } else {
//     return res.redirect("/login");
//   }
// });

app.use(async (req, res, next) => {
  if (req.session.user) {
    if (req.session.user.ID == req.params.ID)
      if (req.session.user.authentication) {
        // check if this user is that
        // console.log(req.originalUrl);
        console.log(
          `[${new Date().toUTCString()}]: ${req.method} ${
            req.originalUrl
          } ("Authenticated User")`
        );
      }
  } else {
    console.log(
      `[${new Date().toUTCString()}]: ${req.method} ${
        req.originalUrl
      } ("Non-Authenticated User")`
    );
  }
  next();
});

// app.use('/post/:commentId/deleteComment', async (req, res, next) => {
//   console.log(req);
//   if (req.method == 'GET') {
//     req.method = 'DELETE';
//   }
//   next();
// });

app.use("/post/:postId/delete", async (req, res, next) => {
  if (req.method == "POST") {
    req.method = "DELETE";
  }
  next();
});

app.use("/user/reviews/delete/:reviewId", async (req, res, next) => {
  if (req.method == "POST") {
    req.method = "DELETE";
  }
  next();
});

app.use("/seekers/searchArea", async (req, res, next) => {
  if (req.method == "POST") {
    req.method = "PUT";
  }
  next();
});

app.use("/user/reviews/edit/:reviewId", async (req, res, next) => {
  if (req.method == "POST") {
    req.method = "PUT";
  }
  next();
});

app.use("/post/filter", async (req, res, next) => {
  if (req.method == "POST") {
    req.method = "GET";
  }
  next();
});

app.use("/home/provideList/searchArea", async (req, res, next) => {
  if (req.method == "POST") {
    req.method = "GET";
  }
  next();
});

app.use("/home/provideList/sortBy", async (req, res, next) => {
  if (req.method == "POST") {
    req.method = "GET";
  }
  next();
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server");
  console.log("Your routes will be running on http://localhost:3000");
});
