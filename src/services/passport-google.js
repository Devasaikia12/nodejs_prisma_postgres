const GoogleStrategy = require('passport-google-oauth20').Strategy
const google = require('../config/client_secret.json')
const config = {
  clientID: google.web.client_id,
  clientSecret: google.web.client_secret,
  callbackURL: '/auth/google/callback',
}

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      config,
      async (accessToken, refreshToken, profile, done) => {
        console.log("GOOGLE BASED OAUTH VALIDATION GETTING CALLED")
        return done(null, profile)
      }
    )
  )

  //seriallize passport user

  //--- serialize and deserialize user
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    done(null, id)
  })
}
