import { closeConnection, dbConnection } from './config/mongoConnections.js';
import { projectData, userData, postData } from './data/index.js';
let date = new Date();

async function main(){
  const db = await dbConnection();
  await db.dropDatabase();

  console.log("seeding started");

//   console.log("Inserting User provider data!");

  // const post = await

  const provider1 = await userData.create(
    "John",
    "Doe",
    "1990-01-01",
    "johndoe@example.com",
    "1234567890",
    "Abcd123!",  
    "provider",
    "10001",
    "New York",
    "NY"
  );

  const provider2 = await userData.create(
    "Alice",
    "Jones",
    "1985-02-15",
    "alicejones@example.com",
    "5555555555",
    "aBcd123!",
    "provider",
    "60601",
    "Chicago",
    "IL"
  );

  const provider3 = await userData.create(
    "Bob",
    "Brown",
    "1970-11-20",
    "bobbrown@example.com",
    "2222222222",
    "1Bcd123!",
    "seeker",
    "75201",
    "Dallas",
    "TX"
  );
//   const userP = await users.create("RushirajProvider", "Herma", "rherma@stevens.edu", "9876543210", "!r126Rvjhjvjh_", "provider", "07307", "Hoboken", "NJ", [], "This is my bio", [], {}, "01/01/2000");
//   console.log(userP);
//   create =  (
//   userId,
//   title,
//   description,
//   budget,
//   role,
//   categories,
//   location_zip_code,
//   location_city,
//   location_state,
//   images
// )


//   // const mikey = await users.create("Mikey", "Brewer", "04-30-1998", "mikeybrewer430@gmail.com", "7328903110", "MikeyB123!", "provider", "07030", "Hoboken", "NJ", "", "bio", [], {});

//   console.log("Inserting User seeker data!");
//   const userS = await users.create("RushirajSeeker", "Herma", "rherma1@stevens.edu", "9876543210", "!r126Rvjhjvjh_", "provider", "07307", "Hoboken", "NJ", [], "This is my bio", [], {}, "01/01/2000");
//   console.log(userS);
//     // console.log("Inserting User seeker data!")
//     // const userS = await users.create("rherma","Rushiraj_Seeker","Herma","rherma@stevens.edu","!r126_","seeker","9876543210","Hoboken",[],"This is my bio",[],{},"01/01/2000")
//     // console.log(userS)
// try{
//   console.log("Inserting posts data!");
//   const post1 = await posts.create(userS.newUser._id, "Plumber Needed URGENTLY!1", "This evil turtle and his baby just stole a princess. They want to duke it out over a game of baseball. Also, the faucet in my kitchen sink is leaking and I need someone to fix it as soon as possible.", "Hoboken", ["plumbing"], 5000);
//   console.log(post1);
// }
// catch(e){
//   console.log(e);
// }

    

//   console.log("Inserting posts data!");
//   const post2 = await posts.create(userS.newUser._id, "Plumber Needed URGENTLY!2", "This evil turtle and his baby just stole a princess. They want to duke it out over a game of baseball. Also, the faucet in my kitchen sink is leaking and I need someone to fix it as soon as possible.", "Hoboken", ["plumbing"], 5000);
//   console.log(post2);

//   console.log("Inserting posts data!");
//   const post3 = await posts.create(userS.newUser._id, "Electrician Required ASAP!", "A group of mischievous monkeys got into my house and messed up all the electrical wires. I need an electrician to come and fix it immediately. Also, my bathroom light fixture is not working and needs to be repaired as well.", "Jersey City", ["electrical"], 6000);
//   console.log(post3);
    
//   console.log("Inserting posts data!");
//   const post4 = await posts.create(userS.newUser._id, "Carpenter Needed Urgently!", "My bookshelf collapsed and now all my books are scattered on the floor. I need a carpenter to come and fix it ASAP. Also, my front door is creaking and needs some attention.", "Newark", ["carpentry"], 6000);
//   console.log(post4);
//   console.log("Inserting posts data!");
//   const post5 = await posts.create(userS.newUser._id, "Gardener Needed Immediately!", "My backyard is a mess and I need someone to come and tidy it up. The grass is overgrown and there are weeds everywhere. Also, I need some advice on what plants to grow in this climate.", "Paterson", ["gardening"], 4500);
//   console.log(post5);
//   console.log("Inserting posts data!");
//   const post6 = await posts.create(userS.newUser._id, "Painter Needed Urgently!", "I'm moving out of my apartment next week and need the walls painted before then. The colors are currently too bright and I want them to be more neutral. Also, the bathroom tiles need to be re-grouted.", "Elizabeth", ["painting"], 7000);
//   console.log(post6);
//   console.log("Inserting posts data!");
//   const post7 = await posts.create(userS.newUser._id, "Mover Needed ASAP!", "I just bought a new couch and need it to be moved to my second-floor apartment. The stairs are narrow and I'm afraid I might damage the walls. Also, I need help disassembling my old bed.", "Trenton", ["moving"], 5500);
//   console.log(post7);
//   console.log("Inserting posts data!");
//   const post8 = await posts.create(userS.newUser._id, "Handyman Needed Urgently!", "I have a long list of small household tasks that need to be done. The light bulb in my closet needs to be replaced, the toilet is running, and the doorknob in the guest bedroom is loose. Also, the dryer vent needs to be cleaned.", "Hackensack", ["handyman"], 5000);
//   console.log(post8);
//   console.log("Inserting posts data!");
//   const post9 = await posts.create(userS.newUser._id, "Roofer Needed Immediately!", "There's a leak in my roof and water is dripping into my living room. I need a roofer to come and fix it as soon as possible. Also, I want to install some solar panels on my roof.", "Camden", ["roofing"], 9000);
//   console.log(post9);
//   console.log("Inserting posts data!");
//   const post10 = await posts.create(userS.newUser._id, "Cleaner Needed Urgently!", "I'm hosting a dinner party tonight and my house is a mess. The carpets need to be vacuumed, the windows need to be washed, and the kitchen needs to be deep-cleaned. Also, I want my oven to be cleaned thoroughly.", "Morristown", ["cleaning"], 4000);


//   console.log("Inserting direct message data!");
//   const directMessage = await directMessages.create(userP.newUser._id, userS.newUser._id, "I am the service provider you are looking for!");
//   console.log(directMessage);
  

    
  console.log("done seeding database!");
  await closeConnection();
}

main()