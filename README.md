# spaces

**Hosted at:** https://rosemhong-spaces.herokuapp.com/

**Description:** A Node.js web application for users to upload and discover their favorite spaces.

**Features:**
- *Authentication*:
  - User login and registration
  - Admin login and registration with access code
- *Authorization*:
  - Users must be authenticated to create new posts and comments
  - Users may not edit or delete other users' posts and comments
  - Admin ability to manage all posts and comments
- *Functionality*:
  - Create, edit, and delete posts and comments
  - Display each space's location on Google Maps
  - Display the time elapsed since each space or comment was posted
- Flash messages 
- RESTful routes

**Backend:** Node.js, Express.js; MongoDB; Passport.js; Google Maps API