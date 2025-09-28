// This file is now a regular JS file without types
// You can use this to add custom properties to req object in middleware

// Example middleware to attach a user or multer file to req object
// Add this kind of middleware in your actual routes if needed

// user.model.js import
const User = require("../models/user.model");

// This part is just for documentation (not functional in JS)
const exampleReqStructure = {
  file: {
    profilePicture: [
      /* Multer file object */
    ]
  },
  files: {
    fieldname: [
      /* Multer file object */
    ]
  },
  user: new User() // attached user
};

// Exporting a plain JS object (optional, just for structure reference)
const Question = {
  type: String,
  technology: String,
  question: String,
  answer: String,
  review: String,
};

module.exports = {
  Question
};
