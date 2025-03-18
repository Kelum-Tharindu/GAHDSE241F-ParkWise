const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

const initializePassport = (passport) => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: "your-google-client-id", // Replace with your Google Client ID
                clientSecret: "your-google-client-secret", // Replace with your Google Client Secret
                callbackURL: "http://localhost:5000/api/auth/google/callback",
            },
            async (accessToken, refreshToken, profile, done) => {
                // Check if the user already exists in your database
                let user = await User.findOne({ googleId: profile.id });

                if (!user) {
                    // Create a new user
                    user = new User({
                        googleId: profile.id,
                        username: profile.displayName,
                        email: profile.emails[0].value,
                    });
                    await user.save();
                }

                return done(null, user);
            }
        )
    );

    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        const user = await User.findById(id);
        done(null, user);
    });
};

module.exports = { initializePassport };