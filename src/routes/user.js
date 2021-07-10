const router = require('express').Router()
const {
  getAllUsers,
  signup,
  getUserPosts,
  signin,
  logout,
  verification,
  profile,
  getUserProfile,
  getUserDetails,
} = require('../controllers/UserController.js')
const {
  signupValidator,
  signinValidator,
  result,
} = require('../middleware/validator/userValidation')
const route = require('./post.js')

const auth = require('../middleware/authMiddleware')
const { render } = require('ejs')
//-- get all users
router.get('/', getAllUsers)
//---@desc : user register/signup routes
//--- method :GET load signup form
router.get('/signup', (req, res) => {
  res.render('signup')
})
//--- method :POST post signup form data
router.route('/signup').post(signupValidator, signup)

//--@ desc : user to login to appilication
//--- method :GET load signin form
router.get('/signin', (req, res) => {
  res.render('login')
})
//-- method : POST post signin form
router.route('/signin').post(signinValidator, signin)

//--- @desc: get user acknowledgement on register to the app
//----method : GET
router.get('/signupAck', (req, res) => {
  res.render('signupConfirm')
})

//----@desc : verify user account
//--- method : GET verification form
router.get('/verification', (req, res) => {
  const token = req.query.token
  const email = req.query.email
  res.render('emailverification', { token, email })
})
//--- method : POST submit verification form
router.route('/verification').post(verification)

//--- @desc : user profile update
//--- method :GET get user information
router.get('/profile', auth, getUserDetails)
//-- method : POST submit user information details
router.route('/profile').post(auth, profile)

//--- @desc : get all user related information
router.get('/profileInfo', auth, getUserProfile)

router.route('/getUserPosts').get(auth, getUserPosts)
router.route('/logout').get(logout)

module.exports = router
