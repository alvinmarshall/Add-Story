const path = require("path");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
//load routes

//ideas route
const ideasRoute = require("./routes/ideas");
const usersRoute = require("./routes/users");

//configure mongo db
const db = require("./config/database");
mongoose.Promise = global.Promise;
mongoose
  .connect(db.mongoUri, { useNewUrlParser: true })
  .then(() => console.log("MongoDb connected..."))
  .catch(err => console.error(err));

//passport config
require("./config/passport")(passport);
//middle ware

//set path
app.use(express.static(path.join(__dirname, "public")));

//handle bar
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//method override
app.use(methodOverride("_method"));

//session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// passport session
app.use(passport.initialize());
app.use(passport.session());

// connect flash
app.use(flash());

//Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

//routes

//index
app.get("/", (req, res) => {
  res.render("home");
});

//about
app.get("/about", (req, res) => {
  res.render("home/about");
});

//ideas
app.use("/ideas", ideasRoute);

//users
app.use("/users", usersRoute);

//start app
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
