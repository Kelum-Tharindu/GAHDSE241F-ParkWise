const mongoose = require("mongoose");

const  testUserSchema = new mongoose.Schema({
  t_username: {
    type: String,
    unique: true,
    sparse: true, 
    trim: true,
    minlength: [3, "Username must be at least 3 characters long"],
    maxlength: [30, "Username cannot exceed 30 characters"],
  },
  t_password: {
    type: String,
    minlength: [6, "Password must be at least 6 characters long"],
  },
  t_email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email address",
    ],
  },
});

const TestUser = mongoose.model("TestUser", testUserSchema);
module.exports = TestUser;