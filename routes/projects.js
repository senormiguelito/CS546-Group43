import { Router } from "express";
const router = Router();
import { userData } from "../data/index.js";
import { projectData } from "../data/index.js";
import { ObjectId } from "mongodb";
import * as h from "../helpers.js";
import xss from "xss"; // -------------> we need to wrap every req.body.... with xss(req.body....) <------------------------

router.route("/").get(async (req, res) => {
  let userId = req.session.user.userID; // unsure of id-- is it userId or projectId? in this route, if wrong, replace all projectId with userId
  const userProjects = await projectData.getAllProjectsByUser(userId);

  try {
    h.checkId(userId);
    userId = userId.trim(); // might as well
    if (!ObjectId.isValid(userId)) throw new Error("invalid userId");
  } catch (e) {
    return res.status(400).redirect("/", { error: e }); //  unverified, not sure where to redirect. Need help. And jesus.
  }

  console.log("userProjects", userProjects);
  console.log("userProjects.noProjects: ", userProjects.noProjects);
  try {
    if (userProjects.noProjects) {
      return res.render("projects", { userProjects: userProjects, noProjects: true });
    }
    if (userProjects.projects) {
      return res.render("projects", { userProjects: userProjects, projects: true });
    }
  } catch (e) {
    return res.redirect("/home", 400);
  }
})

router
  .route("/:userId") // getAll projects involved from this userId
  .get(async (req, res) => {
    let userId = req.session.user.userID; // unsure of id-- is it userId or projectId? in this route, if wrong, replace all projectId with userId
    const userProjects = await projectData.getAllProjectsByUser(clientId)
    try {
      h.checkId(userId);
      userId = userId.trim(); // might as well
      if (ObjectId.isValid(userId)) throw new Error("invalid userId");
    } catch (e) {
      return res.status(400).redirect("/", { error: e }); //  unverified, not sure where to redirect. Need help. And jesus.
    }

    try {
      if (userProjects.noProjects) {
        return res.status(200).render("projects", { projects: noProjects });
      } else {
        message = "Here are your projects! You are building the community!";
        return res.status(200).render("projects", { projects: projects, Message: message });
      }
    } catch (e) {
      return res.status(400).render("home", { error: e }); // ask smart group members about render in case of error
    }
  })
  .post(async (req, res) => {
    const clientId = req.params.clientId;
    const assignedToId = req.params.assignedToId;

    const projectInfo = xss(req.body);
    try {
      // h.checkId(clientId);
      // h.checkId(assignedToId);
      if (!clientId) throw new Error("invalid req.param: clientId");
      if (!assignedToId) throw new Error("invalid req.param: assignedToId");

      h.checkTitle(projectInfo.title);
      h.checkDescription(projectInfo.description);
      h.checkId(projectInfo.clientId);
      h.checkId(projectInfo.assignedToId);
      h.checkstatus(projectInfo.status);
    } catch (e) {
      return res.status(400).redirect("/", { error: e }); // just return to /projects page
    }

    try {
      await userData.get(req.params.userId); // confused on the userId aspect here. Can someone verify/check this
      const createProject = await projectData.create(
        // req.params.userId,      // figure out about userId or projectId?
        req.params.title,
        req.params.description,
        clientId,
        req.params.status,
        assignedToId
      );

      const user = await projectData.getUserByProject(
        createProject._id.toString()
      );

      const bothUsers = await projectData.getBothUsersByProject(
        createProject._id.toString()
      );
      const client = bothUsers[0];
      const assignedTo = bothUsers[1];

      if (user._id.toString() === client._id.toString()) {
        const clientProjects = await projectData.getAllProjectsByUser(
          user._id.toString()
        );
        return res.status(200).render("projects", { projects: projects }); // returns updated client projects
      } else if (user._id.toString() === assignedTo._id.toString()) {
        const assignedToProjects = await projectData.getAllProjectsByUser(
          user._id.toString()
        );
        return res.status(200).render("projects", { projects: projects }); // returns updated user projects
      }
      // Maybe this works? Idea is to render the projects page with the updated user projects after insertion.
    } catch (e) {
      return res.status(404).render("error", { error: e });
    }
  })
  .delete(async (req, res) => {
    try {
      if (!req.params.id) throw new Error("No projectId specified");
      h.checkId(req.params.id);
    } catch (e) {
      return res.status(400).redirect("../home", { error: e });
    }

    try {
      // this is tripping me up because in the data function I call both users to remove, but here I am unsure how/if I need to do that
      const users = await projectData.getBothUsersByProject(
        req.params.id.toString()
      );
      // users is an array
      const client = users[0];
      const assignedTo = users[1];

      const removeProject = await projectData.removeProject(req.params.id); // remove project by requested projectId

      let clientRemoved;
      let assignedToRemoved;

      for (let i in client.projects) {
        if (
          removeProject._id.toString() === client.projects[i]._id.toString()
        ) {
          clientRemoved = true;
          //res.status(200).render({ projectId: req.params.id, deleted: true });
        }
      }
      for (let i in assignedTo.projects) {
        if (
          removeProject._id.toString() === assignedTo.projects[i]._id.toString()
        ) {
          assignedToRemoved = true;
          //res.status(200).render({ projectId: req.params.id, deleted: true });
        }
      }

      if (clientRemoved && assignedToRemoved) {
        return res
          .status(200)
          .redirect("/projects", { projectId: req.params.id, deleted: true });
      } else {
        throw new Error("We had a problem deleting that project");
      }
    } catch (e) {
      return res.status(404).render("error", { error: e });
    }
  });

router.route("/").get(async (req, res) => {
  let userId = req.session.user.userID; // unsure of id-- is it userId or projectId? in this route, if wrong, replace all projectId with userId
  const userProjects = await projectData.getAllProjectsByUser(userId);

  try {
    h.checkId(userId);
    userId = userId.trim(); // might as well
    if (!ObjectId.isValid(userId)) throw new Error("invalid userId");
  } catch (e) {
    return res.status(400).redirect("/", { error: e }); //  unverified, not sure where to redirect. Need help. And jesus.
  }

  console.log("userProjects", userProjects);
  console.log("userProjects.noProjects: ", userProjects.noProjects);
  try {
    if (userProjects.noProjects) {
      return res.render("projects", { userProjects: userProjects, noProjects: true });
    }
    if (userProjects.projects) {
      return res.render("projects", { userProjects: userProjects, projects: true });
    }
  } catch (e) {
    return res.redirect("/home", 400);
  }
})

router
  .route('/:projectId').get(async (req, res) => {  // get projectById
    let message = "";
    let projectId = req.params.projectId;
    try {
      if (!projectId) throw new Error("id not specified");
      h.checkId(projectId);
    } catch (e) {
      return res.status(400).redirect("/projects", { error: e });
    }
    try {
      const projectReq = await projectData.getProjectById(projectId);
      if (!projectReq)
        throw new Error(
          "project with this projectId was not found in the database"
        );
      message = "we found the project you're looking for!\n";
      res
        .status(200)
        .render("projects", { projectId: projectReq, Message: message });
    } catch (e) {
      return res.status(404).render("error", { error: e });
    }
  })
  .put(async (req, res) => {
    // fixed router.route reference error
    // to update project title/description/status
    const projectInfo = xss(req.body);
    let projectId = req.params.projectId;
    let message = "";
    try {
      h.checkId(projectId);
      projectId = projectId.trim();
      if (!ObjectId.isValid(projectId)) throw new Error("invalid projectId");

      h.checkTitle(projectInfo.title);
      h.checkDescription(projectInfo.description);
      h.checkId(projectInfo.clientId);
      h.checkId(projectInfo.assignedToId);
      h.checkstatus(projectInfo.status);
    } catch (e) {
      return res.status(400).redirect("/", { error: e });
    }
    try {
      const findProject = await projectData.getProjectById(projectId);
      if (!findProject)
        throw new Error("project with this specified projectId was not found");
    } catch (e) {
      return res.status(404).render("error", { error: e });
    }
    try {
      // const project = await projectData.getProjectById(projectId);

      const updatedProject = await projectData.updateProject(
        projectId,
        projectInfo.title,
        projectInfo.description,
        projectInfo.status
      );
      return res
        .status(200)
        .redirect("/projects", { projectId: projectId, updated: true });
    } catch (e) {
      return res.status(400).redirect("/", { error: e });
    }
  });

router.route("/").get(async (req, res) => {
  let userId = req.session.user.userID; // unsure of id-- is it userId or projectId? in this route, if wrong, replace all projectId with userId
  const userProjects = await projectData.getAllProjectsByUser(userId);

  try {
    h.checkId(userId);
    userId = userId.trim(); // might as well
    if (!ObjectId.isValid(userId)) throw new Error("invalid userId");
  } catch (e) {
    return res.status(400).redirect("/", { error: e }); //  unverified, not sure where to redirect. Need help. And jesus.
  }

  console.log("userProjects", userProjects);
  console.log("userProjects.noProjects: ", userProjects.noProjects);
  try {
    if (userProjects.noProjects) {
      return res.render("projects", {
        userProjects: userProjects,
        noProjects: true,
      });
    }
    if (userProjects.projects) {
      return res.render("projects", {
        userProjects: userProjects,
        projects: true,
      });
    }
  } catch (e) {
    return res.redirect("/home", 400);
  }
});

export default router;
