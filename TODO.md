# NOTE on codes

1. Error code 400 implies a bad request (by the user)
2. Error code 403 implies user is unauthorized to reach the page they are trying to (not logged in/registered)
3. Error code 404 implies not found
4. Error code 500 is a server error
   Lets keep error codes consistent and correct

FYI I am going to .gitignore public/images

## Monday 5/8

### Rating/review
* there should be a way for a user to see their reviews in profile page or somewhere!
* filter by rating
* option to edit/delete review (not a core feature, put way on back burner)

### AJAX submission

* When a user displays interest on a post, this is where we will meet the AJAX req --> update the interest count without needing to reload the entire page for the user ;)

### Profile

* when a user lands on a profile, ability for session user to share their profile as a direct message to the user who's profile they are viewing

#### Profile -> Posts

* when a user lands on a profile ability to view all of the user's posts whos profile they are on

### Posts

* show the name of the user who posted above the post itself, or somewhere on the page that makes sense
* categories needs way more options, the list is very incomplete. Maybe "other" option that will allow user to add another? Kaushal this is up to you
* If a user is already a prospect for a job, they should not be able to double insert

### Tota11y

* someone has to take on: [https://khan.github.io/tota11y/](https://khan.github.io/tota11y/)

#### Post author -> view all prospects -> route to profile

* post author should be able to view each of the prospects' profiles by clicking a link

### Break the code!

* as soon as we finish the last of these reqs, find every which way to break the shit outta this and stop that from happening

### Seed file for submission

* a lot of the objects/documents/etc have changed in the process.
* Need a seed file that has all the latest functionality & tweaks so nothing disagrees when graders test the code and try to break the website

--------------------------------

## Saturday 12:30

Input sanitization is easy. xss wrap every req.body --> BEWARE OF ARRAYS

* xss(req.body) will turn anything inside parentheses into a string

### providerList.handlebars

need to link 

## Update Friday Night/Saturday morning

New design is badass. Profile & edit profile looks sooo good.
Notes:

### route/post.js

I need someone smart and brave to fix the error for me in /profile/:userId

* successfully links when clicking on their own profile, but I can't get it to link correctly to other users

### Edit profile

* user should not be required to upload a picture to successfully edit their profile
* user should be redirected to their profile after submitting changes
* ability to add more than 1 category is not working, and upon submission no categories are being pushed into the array

### Homepage

* filter button constantly resets to job provider after clicking find, which isn't successfully showing job providers/seekers on submission

### My posts

* Is not displaying :( even tho theres stuff in the collection

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

### data/posts.js

Helper functions are implemented, its cleaned up. Rushiraj, check thru and make sure all objects are returning as you want them to
**need to check on what we want to do with images**

### Unauthorized access (403)

If a user types in a specific url (which does correspond to an existing route), lets make the message that appears correspond to the page they tried to access and that they must be logged in to access it

If a user types in an invalid (nonexisting route) url --> ERROR 404 NOT FOUND --> hide the toolbar/contents of the website just like login/signup

### My posts

### Mikey sux

I suck at coding

SOMEONE PLEASE CHECK OVER THE PROJECTS ROUTES

### AJAX

Need at least 1 ajax form submission

#### (tota11y accessibility shit ....for much, much later on)

can't forget about because there is a lot of points to be lost for this

### input sanitization

Need to defend against XSS attacks with inputs

* "wrap the request body in a function that handles it for you" - Ryan the TA, found in Slack channel

------------------------------;
mongo makes it very easy to use geolocation to filter results based on the area.
Come see him he'll show you his snippet from back when using it.
Documentation is OJ Simpleton
