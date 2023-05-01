import express from "express";
import configRoutes from "./routes/index.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import exphbs from "express-handlebars";
import session from "express-session";
import helmet from "helmet";

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

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "default-src": ["'self'"],
      "script-src": ["'self'", "api.zippopotam.us"], // i used outside resource for get city and state name by zipcode and to allow that i have to use helmet, otherwise it was throwing an error.
      "connect-src": ["'self'", "api.zippopotam.us"],
    },
  })
);

// middleware functions will be here but in the end will do it.

app.use(async (req, res, next) => {
  if (req.session.user) {
    // console.log(req.originalUrl);
    if (req.session.user.authentication)
      console.log(
        `[${new Date().toUTCString()}]: ${req.method} ${
          req.originalUrl
        } ("Authenticated User")`
      );
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
