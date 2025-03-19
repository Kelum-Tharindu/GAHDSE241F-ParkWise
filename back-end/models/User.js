const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["admin", "user", "landowner"], required: true },
    otpSecret: { type: String }, // Secret key for 2FA
    is2FAEnabled: { type: Boolean, default: false }, // Track if 2FA is enabled
    backupCodes: [{ type: String }],
    hashedBackupCodes: [{ type: String }],
    googleId: { type: String }, // For Google OAuth users
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", UserSchema);
module.exports = User;