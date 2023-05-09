import { user } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import * as h from '../helpers.js';
import { update } from './posts.js';
import { projectData, userData, postData } from './index.js';
let date = new Date();
const userCollection = await user();

export const create = async (
  title,
  description,    // will be the description of the project the user posted
  clientId,     // THIS user
  status,     // not started/in progress/finished --> only 3 options
  assignedToId,      // other user involved
  postId
) => {

  h.checkTitle(title);
  h.checkDescription(description);
  h.checkId(clientId);
  h.checkstatus(status);
  h.checkId(assignedToId);
  h.checkId(postId);
  
/*
  if (!status) {
    status = "not started";   // default value. Ask group. Or can just make drop down. Idk im fookin tired
  }
*/
  const user = await userCollection.findOne({ _id: new ObjectId(clientId) });   // figure out if clientId is correct
  if (!user) throw new Error("No user with that ID in the database");

  const alreadyExists = await userCollection.findOne({ _id: clientId, 'project.title': title });
  if (alreadyExists) {
    console.log("already exists");
    throw new Error(`A project with this user and title of ${title} already exists in the database`);
  }

  let newProjectId = new ObjectId();
  const newProjectInfo = {
    _id: newProjectId,
    title: title,
    description: description,
    clientId: clientId,
    status: status,
    assignedToId: assignedToId,
    createdAt: date.toISOString()
  };

  const updatedClient = await userCollection.updateOne({ _id: new ObjectId(clientId) }, {
    $push: { projects: newProjectInfo }
  });
  const updatedAssignedTo = await userCollection.updateOne({ _id: new ObjectId(assignedToId) }, {
    $push: { projects: newProjectInfo }
  });
  
  const clientCheck = await userData.getUser(clientId);
  const assigneeCheck = await userData.getUser(assignedToId);

  if (updatedClient.modifiedCount === 0 && updatedAssignedTo.modifiedCount === 0) {
    throw new Error("This project was not added to both parties 'projects' arrays :-(");
  }
  else {
    console.log("life is good");

    // implement deletion of the post created by the poster!

    console.log("66create: newProjectInfo: ", newProjectInfo);

    let newProjId = newProjectInfo._id.toString();
    console.log("newProjId");
    // const newProject = await this.get(newProjectId);
    const newProject = await getProjectById(newProjId); // will take us to getProjectById function
    if (!newProject) throw new Error("new project wasn't found in the database");
    console.log("newProject: ", newProject);

    const killthePost = await postData.remove(postId);
    if (killthePost.deleted){
      return {newProject, created: true };  // just like create user func
    }
  }
};

export const getAllProjectsByUser = async (userId) => {
  h.checkValid(userId);
  
  if (!ObjectId.isValid(userId)) throw new Error("invalid userId");
  userId = userId.trim();

  const user = await userCollection.findOne({ _id: new ObjectId(userId) }); // converts string userId to an objectId to be compared
  if (!user) throw new Error("No user with that ID in our database");
  const allUserProjects = user.projects;
  for (let i in allUserProjects) {
    allUserProjects[i]._id = allUserProjects[i]._id.toString();
  }
  if (allUserProjects.length === 0) {
    return {allUserProjects, noProjects: true};    // no projects yet for that user
  } else {
    return {allUserProjects, projects: true};
  }
};

// export const getAllProjects = async () => {
//   // I actually have no clue how to do this -- getting all projects by all users.. really only need 1/2 of users because every project is tied to 2 users
//   // either way, this hurts my brain
//   // create a loop that gets all projects by user and then goes to the next user in the database 
// };

export const getProjectById = async (projectId) => {
  h.checkId(projectId);

  if (!ObjectId.isValid(projectId)) throw new Error("projectId is not a valid objectId");
  projectId = projectId.trim();

  let userProjects = await userCollection.findOne({ 'projects._id': new ObjectId(projectId), }, { projection: { _id: 0, projects: 1 } });
  if (!userProjects) throw new Error("No project with this ID found in our database");
  userProjects = userProjects.projects;
  
  for (let i in userProjects) {
    if (userProjects[i]._id.toString() === projectId) {
      console.log("120 getProject: found it");
      return userProjects[i];
    }
  }

};

export const getUserByProject = async (projectId) => {
  h.checkId(projectId);

  const user = await userCollection.findOne({ 'projects._id': ObjectId(projectId), });
  if (!user) throw new Error("Project was not found attached to any user in the database");
  return user;
};

export const getBothUsersByProject = async (projectId) => {
  h.checkId(projectId);
  const userCollection = await user();

  const project = await this.get(projectId);
  if (!project) throw new Error("Project with this projectId was not found in the database");

  let bothUsers = [];

  const client = await userCollection.findOne({ _id: new ObjectId(project.clientId) });
  if (!client) throw new Error("client for this project not found in the database");
  else bothUsers.push(client);  // client will always be at index 0 of the array
  const assignedTo = await userCollection.findOne({ _id: new ObjectId(projects.assignedToId) });
  if (!assignedTo) throw new Error("no user assigned to this project found in the database");
  else bothUsers.push(assignedTo);  // assigned to will always be at index 1 of the array
  
  return bothUsers;
//  return [client, assignedTo];  // returns IDs of both users involved, as an array

  // const users = await userCollection.find({
  //   projects: {
  //     $elemMatch: {
  //       _id: new ObjectId(projectId);
  //     }
  //   }
  // }).toArray();
  // if (users.length !== 2) throw new Error("The project was not found for both parties involved");
  // return users;
};

export const removeProject = async (projectId) => {
  h.checkId(projectId);
  if (!ObjectId.isValid(projectId)) throw new Error("projectId is an invalid ObjectId");
  projectId = projectId.trim();

  const userCollection = await user();
  const project = await this.get(projectId);
  if (!project) throw new Error("No project with this projectId found in the database");

  const userWithProject = await userCollection.findOne({ 'projects._id': new ObjectId(projectId) });
  if (!userWithProject) throw new Error("A project with this projectId could not be removed, because it was not found in the database");
  
  let user1Id = userWithProject._id;
  user1Id = user1Id.toString();
  let user2Id;
  if (user1Id == project.clientId) {

    user2Id = project.assignedToId;
    user2Id = user2Id.toString();
    const updatedClient = await userCollection.updateOne({ _id: user1Id }, {  // there are 2 users with the project object attached to it
      $pull: { projects: { _id: projectId } }
    });
  
    const updatedAssignedTo = await userCollection.updateOne({ _id: user2Id }, {
      $pull: { projects: { _id: projectId } }
    });

    if (updatedClient.modifiedCount === 0 || updatedAssignedTo.modifiedCount === 0) throw new Error("This project was not removed from both parties 'projects' arrays :-(");
    else {
      // Both updated ==> prepare the return
      const client = await userCollection.findOne({ _id: new ObjectId(user1Id) });
      const clientProjects = client.projects;
      const assignedTo = await userCollection.findOne({ _id: new ObjectId(user2Id) });
      const assignedToProjects = assignedTo.projects;

      for (let i in clientProjects) {
        clientProjects[i]._id = clientProjects[i]._id.toString();
      }
      for (let i in assignedToProjects) {
        assignedToProjects[i]._id = assignedToProjects[i]._id.toString();
      }
      // if (clientProjects.length === 0 || assignedToProjects.length === 0) {
      //   return [];    // no mo projects for that user
      // }
  
      return {
        "client projects now:\n": clientProjects,
        "assigned to user's projects now:\n": assignedToProjects
        };

    }
  }
  
  else if (user1Id == project.assignedToId) {
    user2Id = project.clientId;
    user2Id = user2Id.toString();
    const updatedAssignedTo = await userCollection.updateOne({ _id: user1Id }, {  // there are 2 users with the project object attached to it
      $pull: { projects: { _id: projectId } }
    });
  
    const updatedClient = await userCollection.updateOne({ _id: user2Id }, {
      $pull: { projects: { _id: projectId } }
    });
    if (updatedClient.modifiedCount === 0 || updatedAssignedTo.modifiedCount === 0) throw new Error("This project was not removed from both parties 'projects' arrays :-(");
    else {
      // Both updated ==> prepare the return
      const client = await userCollection.findOne({ _id: new ObjectId(user2Id) });      // inverse of above
      const clientProjects = client.projects;
      const assignedTo = await userCollection.findOne({ _id: new ObjectId(user1Id) });  // inverse of above
      const assignedToProjects = assignedTo.projects;

      for (let i in clientProjects) {
        clientProjects[i]._id = clientProjects[i]._id.toString();
      }
      for (let i in assignedToProjects) {
        assignedToProjects[i]._id = assignedToProjects[i]._id.toString();
      }
      // if (clientProjects.length === 0 || assignedToProjects.length === 0) {
      //   return [];    // no mo projects for that user
      // }
      return {
        "client projects now:\n": clientProjects,
        "assigned to user's projects now:\n": assignedToProjects
        };

    }
  }
  else {
    throw new Error("beep boop. computer not compute.");
  }
};

export const updateProject = async (projectId,
  title, 
  description,
  status
) => {
  h.checkId(projectId);
  h.checkTitle(title);
  h.checkDescription(description);
  h.checkstatus(status);
  if (!ObjectId.isValid(projectId)) throw new Error("invalid projectId");
  projectId = projectId.trim();

  const userCollection = await user();
  const project = await this.getProjectById(projectId);
  if (!project) throw new Error("You can not update a project that does not exist");

  title = title.trim();
  description = description.trim();
  status = status.trim();

  if (title === "") throw new Error("Title can not be empty");
  if (description === "") throw new Error("Project description can not be empty");
  if (status === "") throw new Error("Project status must be defined");

  const updatedProjectInfo = {    // gotta check with group about what to prefix with 'project.' here:
    title: title,
    description: description,
    status: status
  };

  const projectUpdate = await userCollection.updateOne(
    { _id: new ObjectId(projectId) },
    { $set: updatedProjectInfo }
  );
  if (!projectUpdate.matchedCount && !projectUpdate.modifiedCount) throw new Error("Project was not successfully updated :-(");

  const updatedProject = await this.get(projectId);
  return updatedProject;
}