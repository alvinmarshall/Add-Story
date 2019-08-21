if (process.env.NODE_ENV === "production") {
  module.exports = {
    mongoUri:"mongodb+srv://Birikorang:bigcheese11@cluster0-pobrh.mongodb.net/learn_story"
  };
} else {
  module.exports = {
    mongoUri: "mongodb://localhost/learn_story"
  };
}
