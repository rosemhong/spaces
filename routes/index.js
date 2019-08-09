var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", function(req, res) {
	res.render("landing");
});

// Show signup form
router.get("/register", function(req, res) {
	res.render("register", {page: "register"});
});

// Handle signup logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    if (req.body.code === process.env.ADMIN_CODE) {
		newUser.isAdmin = true;
	} else if (req.body.code !== process.env.USER_CODE) {
		req.flash("error", "Incorrect code");
		return res.redirect("back"); 
	}
	User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
			if (newUser.isAdmin) {
				req.flash("success", "Welcome to Spaces, Admin " + req.body.username);
			} else {
				req.flash("success", "Welcome to Spaces, " + req.body.username);
			}
        	res.redirect("/spaces"); 
        });
    });
});

// Show login form
router.get("/login", function(req, res) {
	res.render("login", {page: "login"});
});

// Handle login logic
router.post("/login", passport.authenticate("local",
	{
		successRedirect: "/spaces",
		failureRedirect: "/login",
		failureFlash: true
	}), function(req, res) {
});

// Handle logout logic
router.get("/logout", function(req, res) {
	req.logout();
	req.flash("success", "See you again soon!");
	res.redirect("/spaces");
});

module.exports = router;