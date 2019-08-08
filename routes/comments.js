var express = require("express");
var router = express.Router({mergeParams: true});
var Space = require("../models/space");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// COMMENT NEW
router.get("/new", middleware.isLoggedIn, function(req, res) {
	Space.findById(req.params.id, function(err, space) {
		if (err) {
			console.log(err);
		} else {
			res.render("comments/new", {space: space});
		}
	});
	
});

// COMMENT CREATE
router.post("/", middleware.isLoggedIn, function(req, res) {
	Space.findById(req.params.id, function(err, space) {
		if (err) {
			console.log(err);
			res.redirect("/spaces");
		} else {
			Comment.create(req.body.comment, function(err, comment) {
				if (err) {
					console.log(err);
					req.flash("error", "Sorry, something went wrong");
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					space.comments.push(comment);
					space.save();
					req.flash("success", "Comment created");
					res.redirect("/spaces/" + space._id);
				}
			});
		}
	});
});

// COMMENT EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
	Space.findById(req.params.id, function(err, foundSpace) {
		if (err || !foundSpace) {
			req.flash("error", "Space not found");
			return res.redirect("back");
		}
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if (err) {
				res.redirect("back");
			} else {
				res.render("comments/edit", {space_id: req.params.id, comment: foundComment});
			}
		});
	});
	
});

// COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
		if (err) {
			res.redirect("back");
		} else {
			res.redirect("/spaces/" + req.params.id);
		}
	});
});

//COMMENT DESTROY
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		if (err) {
			req.flash("error", "Sorry, something went wrong");
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted");
			res.redirect("/spaces/" + req.params.id);
		}
	});
});

module.exports = router;