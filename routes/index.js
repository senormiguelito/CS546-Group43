import allRoutes from "./routes.js";
import homeRoutes from "./home.js";
import userRoutes from "./user.js";
import postRoutes from "./post.js";
import projectRoutes from "./projects.js";

const constructorMethod = (app) => {
  app.use("/", userRoutes);
  app.use("/home", homeRoutes);
  app.use("/projects", projectRoutes);
  app.use("/api", allRoutes);
  app.use("/post", postRoutes);

  app.use("*", (req, res) => {
    res.status(404).render("404", { Error: `Page Not found`, isHide: true });
  });
};

export default constructorMethod;
