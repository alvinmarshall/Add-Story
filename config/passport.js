const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userModel = mongoose.model("users");

module.exports = passport => {
  passport.use(
    new localStrategy({ usernameField: "email" }, (email, password, done) => {
      userModel
        .findOne({
          email: email
        })
        .then(user => {
          if (!user) {
            return done(null, false, { message: "No user found" });
          }
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) return done(null, user);
            return done(null, false, { message: "invalid  password" });
          });
        });
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    userModel.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
