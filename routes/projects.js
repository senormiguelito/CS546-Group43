import { Router } from "express";
const router = Router();
import { userData } from "../data/index.js";
import { projectData } from "../data/index.js";
import { ObjectId } from "mongodb";
import * as h from "../helpers.js";
import xss from "xss"; // -------------> we need to wrap every req.body.... with xss(req.body....) <------------------------

router.route("/").get(async (req, res) => {
  let userId = req.session.user.userID;
  console.log("userId", userId);
  const userProjects = await projectData.getAllProjectsByUser(userId);

  try {
    h.checkId(userId);
    userId = userId.trim(); // might as well
    console.log("projRout17")
    if (!ObjectId.isValid(userId)) throw new Error("invalid userId");
    console.log("projRout19")
  } catch (e) {
    return res.status(400).render("error", { error: e, badInput: true });
  }

  try {
    if (userProjects.noProjects) {
      return res.render("projects", { userProjects: userProjects, noProjects: true });
    }
    if (userProjects.projects) {
      return res.render("projects", { userProjects: userProjects, projects: true });
    }
  } catch (e) {
    return res.redirect("/home");
  }
});

// router
//   .route("/:userId") // getAll projects involved from this userId
//   .get(async (req, res) => {
    
//     let userId = req.session.user.userID;
//     try {

//       if (userId === req.params.userId) {   // trying to click on our own projects, view individually

//         const userProjects = await projectData.getAllProjectsByUser(userId);
//         if (userProjects.length === 0) {
//           return res.render("projects", {created: false, noProjects: true, projects: false})
//         }
//         else {
//           return res.render("projects", {
//             created: false,
//             noProjects: false,
//             projects: true,
//             userProjects:userProjects,
//             title: userProjects,
//             description: userProjects.allUserProjects,
//             status: userProjects.allUserProjects.status,
//           });
//         }
//       }

//       h.checkId(userId);
//       userId = userId.trim(); // might as well
//       console.log("ProjRoutes 64")
//       if (ObjectId.isValid(userId)) throw new Error("invalid userId");
//       console.log("projectRoute66")
//     } catch (e) {
//       return res.status(400).render("error", { error: e, badInput: true }); //  unverified, not sure where to redirect. Need help. And jesus.
//     }

//     try {
//       if (userProjects.noProjects) {
//         return res.status(200).render("projects", { projects: noProjects });
//       } else {
//         message = "Here are your projects! You are building the community!";
//         return res.status(200).render("projects", { projects: projects, Message: message });
//       }
//     } catch (e) {
//       return res.status(400).render("home", { error: e }); // ask smart group members about render in case of error
//     }
//   })
//   .post(async (req, res) => {
//     const clientId = req.params.clientId;
//     const assignedToId = req.params.assignedToId;

//     const projectInfo = xss(req.body);
//     try {
//       // h.checkId(clientId);
//       // h.checkId(assignedToId);
//       if (!clientId) throw new Error("invalid req.param: clientId");
//       if (!assignedToId) throw new Error("invalid req.param: assignedToId");

//       h.checkTitle(projectInfo.title);
//       h.checkDescription(projectInfo.description);
//       h.checkId(projectInfo.clientId);
//       h.checkId(projectInfo.assignedToId);
//       h.checkstatus(projectInfo.status);
//     } catch (e) {
//       return res.status(400).redirect("/", { error: e }); // just return to /projects page
//     }

//     try {
//       await userData.get(req.params.userId); // confused on the userId aspect here. Can someone verify/check this
//       const createProject = await projectData.create(
//         // req.params.userId,      // figure out about userId or projectId?
//         req.params.title,
//         req.params.description,
//         clientId,
//         req.params.status,
//         assignedToId
//       );

//       const user = await projectData.getUserByProject(
//         createProject._id.toString()
//       );

//       const bothUsers = await projectData.getBothUsersByProject(
//         createProject._id.toString()
//       );
//       const client = bothUsers[0];
//       const assignedTo = bothUsers[1];

//       if (user._id.toString() === client._id.toString()) {
//         const clientProjects = await projectData.getAllProjectsByUser(
//           user._id.toString()
//         );
//         return res.status(200).render("projects", { projects: projects }); // returns updated client projects
//       } else if (user._id.toString() === assignedTo._id.toString()) {
//         const assignedToProjects = await projectData.getAllProjectsByUser(
//           user._id.toString()
//         );
//         return res.status(200).render("projects", { projects: projects }); // returns updated user projects
//       }
//       // Maybe this works? Idea is to render the projects page with the updated user projects after insertion.
//     } catch (e) {
//       return res.status(404).render("error", { error: e });
//     }
//   })

router
  .route('/:projectId').get(async (req, res) => {  // get projectById
    let projectId = req.params.projectId;

    try {
      if (!projectId) throw new Error("id not specified");
      h.checkId(projectId);
    } catch (e) {
      return res.status(400).render("error", { error: e , badInput: true });
    }
    try {
      const projectReq = await projectData.getProjectById(projectId);
      if (!projectReq)
        throw new Error(
          "project with this projectId was not found in the database"
        );
      return res.render("just1project", {
        project: projectReq,
        projectId: projectId
      });
    } catch (e) {
      return res.status(404).render("error", { error: e, badInput: true });
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

export default router;
