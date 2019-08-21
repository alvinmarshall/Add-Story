const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const passport = require("passport");

//load model
require("../models/Users");
const usersModel = mongoose.model("users");

//user login
router.get("/login", (req, res) => {
  res.render("users/login");
});

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post("/register", (req, res) => {
  const errors = [];
  if (!req.body.name) {
    errors.push({ text: "provide your name" });
  }

  if (!req.body.email) {
    errors.push({ text: "provide your email address" });
  }

  if (!req.body.password) {
    errors.push({ text: "provide a password" });
  }

  if (req.body.password.length < 4) {
    errors.push({ text: "password must be aleast 4 characters" });
  }

  if (req.body.password != req.body.confirm_password) {
    errors.push({ text: "password mismatch" });
  }

  if (errors.length > 0) {
    res.render("users/register", {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      confirm_password: req.body.confirm_password
    });
  } else {
    usersModel.findOne({ email: req.body.email }).then(user => {
      if (user) {
        console.log("user email already exist");
        errors.push({ text: "user email already exist" });
        res.render("users/register", {
          errors: errors,
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          confirm_password: req.body.confirm_password
        });
      } else {
        let newUser = {
          name: req.body.name,
          email: req.body.email,
          password: req.body.confirm_password
        };

        bcryptjs.genSalt(10, (err, salt) => {
          bcryptjs.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            new usersModel(newUser)
              .save()
              .then(user => {
                console.log(user);
                req.flash("success_msg", "account created successfully");
                res.redirect("/users/login");
              })
              .catch(err => console.error(err));
          });
        });
      }
    });
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/ideas",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logOut();
  req.flash('success_msg','you logout');
   res.redirect('/users/login');
});

module.exports = router;
