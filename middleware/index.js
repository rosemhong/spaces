var Space = require("../models/space");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		req.flash("error", "You must be logged in to do that");
		res.redirect("/login");
	}
};

middlewareObj.checkSpaceOwnership = function (req, res, next) {
	if (req.isAuthenticated()) {
		Space.findById(req.params.id, function(err, foundSpace) {
			if (err || !foundSpace) {
				req.flash("error", "Space not found");
				res.redirect("back");
			} else {
				if (foundSpace.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "Sorry, you don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You must be logged in to do that");
		res.redirect("back");
	}
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if (err || !foundComment) {
				req.flash("error", "Comment not found");
				res.redirect("back");
			} else {
				if (foundComment.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "Sorry, you don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You must be logged in to do that");
		res.redirect("back");
	}
};

module.exports = middlewareObj;