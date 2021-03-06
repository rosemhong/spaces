var mongoose = require("mongoose");
var spaceSchema = new mongoose.Schema({
	name: String,
	image: String,
	amenities: String,
	description: String,
	location: String,
	credits: String,
	lat: Number,
	lng: Number,
	createdAt: {type: Date, default: Date.now},
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

module.exports = mongoose.model("Space", spaceSchema);