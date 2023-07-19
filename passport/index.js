const passport = require("passport");
const keys = require("../config/keys");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const helper = require("../helpers/helper");
const User = require("../models/User")



// Setup options for JWT Strategy
const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = keys.secretOrKey; //jwtSecretKey;

// Create JWT Strategy
// module.exports = passport => {
// for app api authentication
passport.use(
  "user",
  new JwtStrategy(jwtOptions, async function (payload, done) {
    try {
      // console.log(payload, "payload");
      var criteria = {
        _id: payload.id,
        // email: payload.email,
        login_time: payload.login_time,
      };
      // console.log('criteria---', criteria)
      let data = await User.findOne(criteria)
      if (!data) return done(null, false)
      else return done(null, data)
      // db.staff.findOne({ where: criteria }, function (err, result) {
      //   if (err) {
      //     return done(null, err);
      //   } else if (result) {
      //     return done(null, result);
      //   } else {
      //     return done(null, false);
      //   }
      // });
    } catch (e) {
      console.log("not local");
      console.log(e);
      // return done(e, false);
    }
  })
);

module.exports = {
  initialize: function () {
    return passport.initialize();
  },

  authenticateUser: function (req, res, next) {
   
  
    return passport.authenticate(
      "user",
      {
        session: false,
      },
      (err, user, info) => {
        console.log(user, "=======================>passport err");
        console.log(info, '=======================>passport info');
        // console.log(info && info['name'], '=======================>passport info[name]');
        // console.log(user, '=======================>passport err user');

        if (err) {
          return helper.error(res, err);
        }
        if (
          info &&
          info.hasOwnProperty("name") &&
          info.name == "JsonWebTokenError"
        ) {
          return helper.error(res, {
            message: "Invalid Token.",
            code: 401
          });
        } else if (user == false) {
          return helper.error(res, {
            message: "Authorization is required",
            code: 401
          });
        }
        // Forward user information to the next middleware
        req.user = user;
        next();
      }
    )(req, res, next);
  },
};
