import express from "express";
import configRoutes from "./routes/index.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import exphbs from "express-handlebars";
import session from "express-session";
import helmet from "helmet";
import flash from "connect-flash";
import xss from "xss"; // testing input sanitization -> defends xss attacks
let date = new Date().toUTCString();
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
    // user: {},  //bc kaushal put in the routes, -kaushal: no we don't need to declare it over here, after req.session."any name you want to add", so you can use multiple session, like req.session.user, req.session.post, etc.
    secret: "some secret string!",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "default-src": ["'self'"],
      "script-src": ["'self'", "api.zippopotam.us"], // i used outside resource for get city and state name by zipcode and to allow that i have to use helmet, otherwise it was throwing an error.
      "connect-src": ["'self'", "api.zippopotam.us"],
    },
  })
);
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "default-src": ["'self'"],
      "script-src": ["'self'", "api.zippopotam.us"], // i used outside resource for get city and state name by zipcode and to allow that i have to use helmet, otherwise it was throwing an error.
      "connect-src": ["'self'", "api.zippopotam.us"],
    },
  })
);

app.use(flash());
// middleware functions will be here but in the end will do it.

// 1. redirect to login
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
      isHide: true
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
  // console.log("it is worked");
  // console.log(req.session.user);
  if (req.session.user) {
    // console.log("redirecting to home");
    if (req.session.user.justRegistered) {
      next();
    } else if (req.session.user.authentication) {
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

app.use("/projects", (req, res, next) => {
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
        // req.session.user.ID = user._id // autogenerated id from mongoDb
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

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server");
  console.log("Your routes will be running on http://localhost:3000");
});
