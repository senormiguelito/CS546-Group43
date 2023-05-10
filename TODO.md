# NOTE on codes

1. Error code 400 implies a bad request (by the user)
2. Error code 403 implies user is unauthorized to reach the page they are trying to (not logged in/registered)
3. Error code 404 implies not found
4. Error code 500 is a server error
   Lets keep error codes consistent and correct

FYI I am going to .gitignore public/images

## TUESDAY 5/9

### Middleware routes

* basically verify the user is logged in/able to access any given route

### clientside posts/reviews/projects

* error checking and handling in every route and function
* need a team effort here

### routes/HOME.js

* line 276 catch block I think we need the return statement/resolution, Vamsi your call

### We need a proper SEED FILE

* update repo README

### data/POSTS.js

* DO THE CATEGORIES ERROR CHECKING

### routes/REVIEWRATINGS.js

* line 62 -> if the session user is the same as the req.para	ms.userId, show all of the reviews left about the session user with modified html
* I think the error checking I tried to re-implement is screwing shit up

### Comment routing

* after user has displayed interest, should still be able to see

### AJAX

### Contact

* modify contact button (modal box) to display ways to contact user (phone, email ... social media integration (extra feature)

------------------------------------;

------------------------------------;

## Monday 5/8

### Rating/review

* there should be a way for a user to see their reviews in profile page or somewhere!

### AJAX submission

* When a user displays interest on a post, this is where we will meet the AJAX req --> update the interest count without needing to reload the entire page for the user ;)

#### Profile -> Posts

* when a user lands on a profile ability to view all of the user's posts whos profile they are on

### Tota11y

* someone has to take on: [https://khan.github.io/tota11y/](https://khan.github.io/tota11y/)

### Break the code!

* as soon as we finish the last of these reqs, find every which way to break the shit outta this and stop that from happening

### Seed file for submission

* a lot of the objects/documents/etc have changed in the process.
* Need a seed file that has all the latest functionality & tweaks so nothing disagrees when graders test the code and try to break the website

---

## Saturday 12:30

Input sanitization is easy. xss wrap every req.body --> BEWARE OF ARRAYS

* xss(req.body) will turn anything inside parentheses into a string

## Update Friday afternoon

removed 'login/signup from bottom of views/post --> unnecessary and doesnt work
From vamsi: deleting comment link doesn't work --> route currently is post/{userId}/deletecomment

* going off that, delete link shouldn't show for other users' comments at all

### Posts stuff

* lets keep the text styling consisten--description text doesn't make much sense . Doesn't matter much cause he won't grade on that but quick fix
  If a user is registered as a provider, they can not make a post as a seeker, vice versa
* empty comment shouldn't redirect to error page

## Update 5/5 Early morning

projects: implementing this is really hard. I need assistance. So because it can only be created when both users accept the job, it is difficult to figure out when/how to instantiate that
I am thinking of users will have ability to click a button on the post which will add them to a 'prospects' array. The user who has prospects on the post chooses a prospect (dropdown -> select -> submit), and the project will be created with that prospect's userId.
And upon this project creation, the post can either be deleted or hidden. Up to you guys

I implemented routes for accessing profiles in job providers + seekers by clicking the 'view profile' links.
If a user clicks on their own profile, it takes them to 'myprofile'

* however the URL is not the same as 'myprofile', it is their userId. But it still allows for edit (as far as I can tell)

## Update 5/4

(Mikey): I did a lot of work for projects. It is tricky because it is a subdocument of users, and also because it is attached to 2 user objects simultaneously. So any creation/removal needs to apply to both users involved.
So I implemented a wide permutation of functions (getProjectByProjectId, getProjectByUserId, getBothUsersByProject, getUserByProject, remove, and update) to account for all the functionality we might need

If someone who feels comfortable with 'update'/ HTTP 'PUT' can double/triple check that it is implemented correctly, that would be legendary.
(also please double check on all my shit)

Still for me:
clientside verification for reviews/ratings
clientside for projects
views for reviews/ratings
views for projects
middleware for all the above

Home/posts:

"Want to get something done?" --> rename to "create a post!"

* once post is created, click on to go to post page. Should have more notable way to contact
* the contact link at the bottom doesnt work
* ability to post comment isn't working, creates a "Page Not Found" error, which shouldn't happen and isn't the right error regardless
* on the posts page, clicking on the post leads to "Page Not Found"

"want a job?" links to /post/createJob --> "Page Not Found" with the following error: "error : Error: This id is not a valid ObjectId"

Error upon creating a post with 3 categories "error : Error: Update: each category must be a non-empty string"

link to "See All Providers" (both at top and bottom) is not working, again to "Page Not Found"

* need to get rid of unnecessary duplicate

link at bottom to "Sign Up" not working --> "Page Not Found"

Job Providers:
link works correctly

* Display/format is funky af but thats not a painful fix

"View" link does not work --> "Page Not Found"
"Back" link is working

-------------------------------;
Job Seekers:
works, nothing there

-------------------------------;
My Profile:
link to get to is fine.
Edit is not yet a link, so we need to change that so we can see how the 'edit' functionality is

-------------------------------;
My Posts:
Link does not work --> "Page Not Found"

-------------------------------;
Messages:
Empty page, need to make work on this IMMEDIATELY because there is a lot of testing and checking to do

-------------------------------;
Reviews:
available for any user to put a review, located on the users profile. Later, will require project status "finished" in order to leave a review

-------------------------------;
Tota11y link:
[https://khan.github.io/tota11y/](https://khan.github.io/tota11y/)

### much later extra feature

1. forgot password

------------------------------;

## Update 5/2

1. In our proposal we listed contct and direct messages separately, so to implement contact we can just make a button that reveals all contact info.
   (obviously only viewable if logged in)
2. Still need to implement project creation. Tricky logic, easy once figured out.
   So once people react to each other's posts/interact, they can agree to create a project.
   Projects are necessary to create a review, because the review object will have to refer the id of the project being reviewed
   Projects = subdocument of both users involved
3. Posts needs to be cleaned up:
   create helper functions for each input and/or function and implement those into the code
4. Routes, client side js, middleware!!!
5. Cam we modify the sign up so once they are signed up, it logs them in with that info

### Login/Signup

Once register/login form is submitted, it takes a long time to load... is there a way to improve that?
For log out: add confirmation message after clicking 'Logout' to confirm to the user that they have been logged out

### Profile

'Edit' button is not routing

### Messages

'Messages' page shows blank (assuming currently because there are none..) lets add option to create a message

* by pasting in a userID? Or if that's impractical, by email.
* call getby(email) function, see if it makes sense to have that call the get by id function once you extract the id from the email that corresponds to that user object

### data/users.js

Do we want to throw errors if there are no users found when calling getBy() or just return something empty?
--> return empty () and display a message "No users found when filtering by X"

Helper functions are implemented, its cleaned up. Rushiraj, check thru and make sure all objects are returning as you want them to
**need to check on what we want to do with images**

### Mikey sux

I suck at coding

SOMEONE PLEASE CHECK OVER THE PROJECTS ROUTES
