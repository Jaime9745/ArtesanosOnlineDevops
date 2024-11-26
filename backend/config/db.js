const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect("mongodb+srv://greatstack:2220211014@cluster0.fwhsu.mongodb.net/food-del").then(() =>
    console.log("DB Connected")
  );
};

module.exports = { connectDB };

// add your mongoDB connection string above.
// Do not use '@' symbol in your databse user's password else it will show an error.