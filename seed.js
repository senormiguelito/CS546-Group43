import { closeConnection, dbConnection } from './config/mongoConnections.js';
import * as users  from './data/users.js';
import * as posts from './data/posts.js'
import * as reviewRatings from './data/reviewRatings.js'
import * as directMessages from './data/directMessages.js'

async function main(){
    const db = await dbConnection()
    // await db.dropDatabase()

    console.log("seeding started")

    console.log("Inserting User provider data!")
    const userP = await users.create("rherma","Rushiraj_Provider","Herma","rherma@stevens.edu","!r126_","provider","9876543210","Hoboken",[],"This is my bio",[],{},"01/01/2000")
    console.log(userP)

    console.log("Inserting User seeker data!")
    const userS = await users.create("rherma","Rushiraj_Seeker","Herma","rherma@stevens.edu","!r126_","seeker","9876543210","Hoboken",[],"This is my bio",[],{},"01/01/2000")
    console.log(userS)

    console.log("Inserting posts data!")
    const post = await posts.create(userS._id,"Plumber Needed URGENTLY!","This evil turtle and his baby just stole a princess. They want to duke it out over a game of baseball. Also, the faucet in my kitchen sink is leaking and I need someone to fix it as soon as possible.","Hoboken",["plumbing"],5000)
    console.log(post)
    
    console.log("Inserting reviewRatings data!")
    const reviewRating = await reviewRatings.create(userS._id,userP._id, post._id,5.0,"Best work I have ever seen in my lifetime")
    console.log(reviewRating)

    console.log("Inserting direct message data!")
    const directMessage = await directMessages.create(userP._id,userS._id,"I am the service provider you are looking for!")
    console.log(directMessage)
    

    console.log("done seeding database")
    await closeConnection()
}

main()