import { generateRefreshToken, generateToken } from "../utils/generate-token";
import { RefreshToken } from "./../models/token";
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
import User from "../models/user";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const deviceIp = req.cookies.deviceIp || "Unknown IP";
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
          });
        }
        const token = generateToken(user);
        const refreshToken = generateRefreshToken(user, deviceIp);
        return done(null, { user, token, refreshToken });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FACEBOOK_APP_ID,
//       clientSecret: process.env.FACEBOOK_APP_SECRET,
//       callbackURL: process.env.FACEBOOK_CALLBACK_URL,
//       profileFields: ["id", "displayName", "email"],
//     },
//     async (req, accessToken, refreshToken, profile, done) => {
//       const deviceIp = req.cookies.deviceIp || "Unknown IP";
//       try {
//         let user = await User.findOne({ facebookId: profile.id });
//         if (!user) {
//           user = await User.create({
//             facebookId: profile.id,
//             name: profile.displayName,
//           });
//         }
//         const token = generateToken(user);
//         const refreshToken = generateRefreshToken(user, deviceIp);
//         return done(null, { user, token, refreshToken });
//       } catch (err) {
//         return done(err, null);
//       }
//     }
//   )
// );

passport.serializeUser((userData, done) => {
  done(null, userData);
});

passport.deserializeUser((userData, done) => {
  done(null, userData);
});
