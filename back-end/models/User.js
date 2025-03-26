const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    sparse: true, // Allows null for Google OAuth users
    trim: true,
    minlength: [3, "Username must be at least 3 characters long"],
    maxlength: [30, "Username cannot exceed 30 characters"],
  },
  password: {
    type: String,
    minlength: [6, "Password must be at least 6 characters long"],
  },
  email: {
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
  role: {
    type: String,
    enum: ["admin", "user", "landowner"],
    default: "user",
    required: [true, "Role is required"],
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpire: {
    type: Date,
  },
  otpSecret: { type: String }, // Secret key for 2FA
  is2FAEnabled: { type: Boolean, default: false }, // Track if 2FA is enabled
  backupCodes: [{ type: String }], // Backup codes for 2FA
  hashedBackupCodes: [{ type: String }], // Hashed backup codes for security
  googleId: { type: String, unique: true, sparse: true }, // For Google OAuth users
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Static method to find or create a Google OAuth user
UserSchema.statics.findOrCreateGoogleUser = async function (profile) {
  let user = await this.findOne({ googleId: profile.id });

  if (!user) {
    // Create a new user if they don't exist
    user = new this({
      googleId: profile.id,
      email: profile.emails[0].value,
      username: profile.displayName || profile.emails[0].value.split("@")[0],
      role: "user", // Default role for Google OAuth users
    });

    await user.save();
  }

  return user;
};

const User = mongoose.model("User", UserSchema);
module.exports = User;