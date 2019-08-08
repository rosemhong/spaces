var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	flash = require("connect-flash"),
	Space = require("./models/space"),
	Comment = require("./models/comment"),
	User = require("./models/user");
	// seedDB = require("./seeds"); - OUTDATED

// Requiring routes
var indexRoutes = require("./routes/index"),
	commentRoutes = require("./routes/comments"),
	spaceRoutes = require("./routes/spaces");

var url = process.env.DATABASEURL || "mongodb://localhost/spaces";
mongoose.connect(url);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); - OUTDATED

app.locals.moment = require("moment");

// Passport configuration
app.use(require("express-session")({
	secret: "Secret spaces??",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/spaces", spaceRoutes);
app.use("/spaces/:id/comments", commentRoutes);

var port = process.env.PORT || 3000;
var ip = process.env.IP || "127.0.0.1";
app.listen(port, function() {
	console.log("Server has started on port " + port);
});