import passportJWT from 'passport-jwt';
import MongoModels from '../app/mongo/db/models/index';

// passport & jwt config
const {
  Strategy: JWTStrategy,
  ExtractJwt: ExtractJWT,
} = passportJWT;

// import User model
const User = MongoModels.UserModel;

// define passeport jwt strategy
const opts = {};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderWithScheme(process.env.JWT_SCHEME);
opts.secretOrKey = process.env.JWT_SECRET_OR_KEY;
const passeportJWTStrategy = new JWTStrategy(opts, function(jwtPayload, done) {
  const email = jwtPayload.email;
  User.findOne({email: email}, (error, user) => {
    if (error) {
      return done(error, false);
    } else {
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    }
  });
});

// config passport
module.exports = function(passport) {
  // token strategy
  passport.use(passeportJWTStrategy);

  // return configured passeport
  return passport;
};
