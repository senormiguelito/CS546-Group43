import { closeConnection, dbConnection } from './config/mongoConnections.js';
import * as users  from './data/users.js';
import * as posts from './data/posts.js'
import * as reviewRatings from './data/reviewRatings.js'
import * as directMessages from './data/directMessages.js'
import * as userData from './data/users.js'
import * as postData from './data/posts.js'
import { ObjectId } from 'mongodb';

async function main(){
  const db = await dbConnection();
  await db.dropDatabase();

  console.log("seeding started");

  // const mikey = await users.create("Mikey", "Brewer", "04-30-1998", "mikeybrewer430@gmail.com", "7328903110", "MikeyB123!", "provider", "07030", "Hoboken", "NJ", "", "bio", [], {});
    // console.log("Inserting User seeker data!")
    // const userS = await users.create("rherma","Rushiraj_Seeker","Herma","rherma@stevens.edu","!r126_","seeker","9876543210","Hoboken",[],"This is my bio",[],{},"01/01/2000")
    // console.log(userS)
    const post1 = await postData.create(
      (new ObjectId()).toString(),
      "Need a dog walker",
      "Looking for someone to walk my dog for an hour each weekday",
      20.0,
      "provider",
      ["pet care", "dog walking"],
      "90210",
      "Beverly Hills",
      "CA",
      {
        name: "dog.jpg",
        type: "image/jpeg",
        size: 56789,
        data: "data:image/jpeg;base64,/9j/4AAQSkZJRgA..."
      }
    );
    console.log("passed")
    // Example 2
    const post2 = await postData.create(
      (new ObjectId()).toString(),
      "Hiring a personal chef",
      "Looking for a personal chef to cook meals for me and my family",
      150.0,
      "seeker",
      ["cooking", "personal chef"],
      "60601",
      "Chicago",
      "IL",
      {
        name: "food.jpg",
        type: "image/jpeg",
        size: 98765,
        data: "data:image/jpeg;base64,/9j/4AAQSkZJRgA..."
      }
    );
    


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
  

    const provider4 = await userData.create(
      "Emily",
      "Smith",
      "1995-06-10",
      "emilysmith@example.com",
      "9999999999",
      "paSsword123!",
      "provider",
      "90210",
      "Beverly Hills",
      "CA"
    );
    
    const provider5 = await userData.create(
      "Michael",
      "Johnson",
      "1988-09-25",
      "michaeljohnson@example.com",
      "4444444444",
      "qweRty456!",
      "provider",
      "94102",
      "San Francisco",
      "CA"
    );
    
    const provider6 = await userData.create(
      "Sarah",
      "Wilson",
      "1980-04-05",
      "sarahwilson@example.com",
      "7777777777",
      "zxcVbn789!",
      "seeker",
      "77002",
      "Houston",
      "TX"
    );
    const post4 = await postData.create(
      (new ObjectId()).toString(),
      "House cleaning service needed",
      "Looking for a reliable cleaner to clean my house twice a week",
      50.0,
      "seeker",
      ["cleaning", "housekeeping"],
      "77002",
      "Houston",
      "TX",
      {
        name: "cleaning.jpg",
        type: "image/jpeg",
        size: 87654,
        data: "data:image/jpeg;base64,/9j/4AAQSkZJRgA..."
      }
    );
    const post3 = await postData.create(
      (new ObjectId()).toString(),
      "Tutor needed for math",
      "Looking for a math tutor for high school-level algebra and geometry",
      30.0,
      "seeker",
      ["tutoring", "math"],
      "94102",
      "San Francisco",
      "CA",
      {
        name: "math.jpg",
        type: "image/jpeg",
        size: 12345,
        data: "data:image/jpeg;base64,/9j/4AAQSkZJRgA..."
      }
    );
            
  console.log("done seeding database!");
  await closeConnection();
  
}

main()