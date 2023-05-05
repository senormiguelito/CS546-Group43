import allRoutes from "./routes.js";
import homeRoutes from "./home.js";
import userRoutes from "./user.js";
import postRoutes from "./post.js"


const constructorMethod = (app) => {
  app.use("/", userRoutes);
  app.use("/home", homeRoutes);
  app.use("/posts", postRoutes);
  app.use("/api", allRoutes);
  app.use("/post", postRoutes);
  // app.use("/home", homeRoutes);

  app.use("*", (req, res) => {
    res.status(404).render("404", { error: `Page Not found` });
  });
};

export default constructorMethod;
