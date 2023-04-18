import allRoutes from "./routes.js";
import homeRoutes from "./home.js";
import userRoutes from "./user.js";

const constructorMethod = (app) => {
  app.use("/", homeRoutes);
  app.use("/user", userRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

export default constructorMethod;
