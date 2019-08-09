var express = require("express");
var router = express.Router();
var Space = require("../models/space");
var middleware = require("../middleware");
var NodeGeocoder = require("node-geocoder");
var options = {
  provider: "google",
  httpAdapter: "https",
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
var geocoder = NodeGeocoder(options);

router.get("/", function(req, res) {
	// Fuzzy search
	if (req.query.search) {
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		Space.find({$or: [{name: regex,}, {amenities: regex}, {description: regex}, {location: regex}, {"author.username":regex}]}, function(err, allSpaces) {
			if (err) {
				console.log(err);
			} else {
				res.render("spaces", {spaces: allSpaces, page: "spaces"});
			}
		});
	} else {
		Space.find({}, function(err, allSpaces) {
			if (err) {
				console.log(err);
			} else {
				res.render("spaces", {spaces: allSpaces, page: "spaces"});
			}
		});
	}
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
	var credits = req.body.credits;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	geocoder.geocode(req.body.location, function(err, data) {
		if (err || !data.length) {
			console.log(err);
			req.flash("error", "Invalid address");
			return res.redirect("back");
		}
		
		var lat = data[0].latitude;
		var lng = data[0].longitude;
		var location = data[0].formattedAddress;
		
		var newSpace = {name: name, image: image, amenities: amenities, description: description, location: location, lat: lat, lng: lng, credits: credits, author: author};
		
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
	geocoder.geocode(req.body.space.location, function(err, data) {
		if (err || !data.length) {
			console.log(err);
			req.flash("error", "Invalid address");
			return res.redirect("back");
		}
		
		req.body.space.lat = data[0].latitude;
		req.body.space.lng = data[0].longitude;
		req.body.space.location = data[0].formattedAddress;
		
		Space.findByIdAndUpdate(req.params.id, req.body.space, function(err, updatedSpace) {
			if (err) {
				console.log(err);
				req.flash("error", "Sorry, something went wrong");
				res.redirect("back");
			} else {
				req.flash("success", "Space updated");
				res.redirect("/spaces/" + req.params.id);
			}
		});
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

// For fuzzy search
function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;