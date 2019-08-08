var express = require("express");
var router = express.Router();
var Space = require("../models/space");
var middleware = require("../middleware");

router.get("/", function(req, res) {
	Space.find({}, function(err, allSpaces) {
		if (err) {
			console.log(err);
		} else {
			res.render("spaces", {spaces: allSpaces});
		}
	});
});

// SPACE NEW
router.get("/new", middleware.isLoggedIn, function(req, res) {
	res.render("spaces/new");
});

// SPACE CREATE
router.post("/", middleware.isLoggedIn, function(req, res) {
	var name = req.body.name;
	var image = req.body.image;
	var amenities = req.body.amenities;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newSpace = {name: name, image: image, amenities: amenities, description: description, author: author};
	
	Space.create(newSpace, function(err, newlyCreatedSpace) {
		if (err) {
			console.log(err);
			req.flash("error", "Sorry, something went wrong");
		} else {
			req.flash("success", "Space created");
			res.redirect("/spaces");
		}
	});
});

// SPACE SHOW
router.get("/:id", function(req, res) {
	Space.findById(req.params.id).populate("comments").exec(function(err, foundSpace) {
		if (err || !foundSpace) {
			req.flash("error", "Space not found");
			res.redirect("back");
		} else {
			res.render("spaces/show", {space: foundSpace});
		}
	});	
});

// SPACE EDIT
router.get("/:id/edit", middleware.checkSpaceOwnership, function(req, res) {
	Space.findById(req.params.id, function(err, foundSpace) {
		res.render("spaces/edit", {space: foundSpace});
	});
});

// SPACE UPDATE
router.put("/:id", middleware.checkSpaceOwnership, function(req, res) {
	Space.findByIdAndUpdate(req.params.id, req.body.space, function(err, updatedSpace) {
		if (err) {
			res.redirect("back");
		} else {
			res.redirect("/spaces/" + req.params.id);
		}
	});
});

// SPACE DESTROY
router.delete("/:id", middleware.checkSpaceOwnership, function(req, res) {
	Space.findByIdAndRemove(req.params.id, function(err) {
		if (err) {
			req.flash("error", "Sorry, something went wrong");
			res.redirect("/spaces");
		} else {
			req.flash("success", "Space deleted");
			res.redirect("/spaces");
		}
	});
});

module.exports = router;