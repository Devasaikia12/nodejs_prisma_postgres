const route = require('express').Router()
const {
  createPost,
  getUserPost,
  getPostForm,
  getPost,
} = require('../controllers/PostController')
const auth = require('../middleware/authMiddleware')

const { validator } = require('../middleware/validator/postValidation')
//---@desc : get all post of user
route.route('/userPost').get(auth, getUserPost)

//--- @desc: route load post create form
//--- method : GET
route.route('/create').get(auth, getPostForm)
route.route('/create').post(validator, auth, createPost)

//--- @desc : route to get individual post
//---method : GET
route.route('/getPost/:id').get(auth, getPost)
module.exports = route
