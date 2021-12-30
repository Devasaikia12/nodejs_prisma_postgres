const passport = require('passport')
const routes = require('express').Router()
const {findAndCreateUserProfile} =  require('../controllers/AuthController')

routes.get('/google', passport.authenticate('google', { scope: ['profile', 'email']}))

routes.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/users/signin' }),
  findAndCreateUserProfile,
)

module.exports = routes
