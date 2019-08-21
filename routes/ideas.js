const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { ensureAuthenticated } = require("../utils/authUtil");
//load model
require("../models/Ideas");
const ideasModel = mongoose.model("ideas");

//add ideas
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("ideas/add");
});

//load ideas
router.get("/", ensureAuthenticated, (req, res) => {
  ideasModel
    .find({ user: req.user.id })
    .sort({ date: "desc" })
    .then(ideas => {
      res.render("ideas", {
        ideas: ideas
      });
    })
    .catch(err => console.error(err));
});

//edit idea
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  ideasModel
    .findOne({ _id: req.params.id })
    .then(idea => {
      if (idea !== null) {
        if (idea.user !== req.user.id) {
          console.log("unauthorized action in edit");
          res.redirect("/ideas");
          return;
        }
        res.render("ideas/edit", {
          idea: idea
        });
        return;
      }
      res.redirect("/ideas");
    })
    .catch(err => console.error(err));
});

//create new idea
router.post("/", ensureAuthenticated, (req, res) => {
  const errors = [];

  if (!req.body.title) {
    errors.push({ text: "please add a title" });
  }

  if (!req.body.details) {
    errors.push({ text: "please add details" });
  }

  if (errors.length > 0) {
    res.render("ideas/add", {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    let newIdea = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    };
    new ideasModel(newIdea).save().then(idea => {
      console.log(idea);
      req.flash("success_msg", "add action successful");

      res.redirect("/ideas");
    });
  }
});

//update idea
router.put("/:id", ensureAuthenticated, (req, res) => {
  ideasModel.findOne({ _id: req.params.id }).then(idea => {
    idea.title = req.body.title;
    idea.details = req.body.details;
    idea.save(() => {
      console.log(idea);
      req.flash("success_msg", "update action successful");
      res.redirect("/ideas");
    });
  });
});

router.delete("/:id", ensureAuthenticated, (req, res) => {
  ideasModel.deleteOne({ _id: req.params.id }).then(() => {
    console.log(`idea id: ${req.params.id} deleted`);
    req.flash("success_msg", "delete action successful");
    res.redirect("/ideas");
  });
});
module.exports = router;
