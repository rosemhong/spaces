var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", function(req, res) {
	res.render("landing");
});

// Show signup form
router.get("/register", function(req, res) {
	res.render("register");
});

// Handle signup logic
router.post("/register", function(req, res) {
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user) {
		if (err) {
			req.flash("error", err.message);
			return res.redirect("/register");
		} else {
			passport.authenticate("local")(req, res, function() {
				req.flash("success", "Welcome to Spaces, " + user.username);
				res.redirect("/spaces");
			});
		}
	});
});

// Show login form
router.get("/login", function(req, res) {
	res.render("login");
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