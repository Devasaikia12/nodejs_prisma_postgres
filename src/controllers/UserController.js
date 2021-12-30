const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { verifyUserMail } = require('../services/email')

const generateToken = require('../uttils/generateToken')
const { render } = require('ejs')

const getAllUsers = async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      name: true,
      email: true,
      post: true,
    },
  })

  res.send(users)
}

const signup = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const alert = errors.array()
      res.render('signup', { alert })
    } else {
      const { firstname, lastname, email, password } = req.body
      const userExist = await prisma.user.findUnique({
        where: { email },
      })

      if (userExist) {
        res.render('signup', [{ msg: 'Email taken. Try another one' }])
      }
      const salt = await bcrypt.genSalt(10)
      const hashPassword = await bcrypt.hash(password, salt)
      const newUser = {
        firstname,
        lastname,
        email,
        password: hashPassword,
      }
      try {
        const userEntered = await prisma.user.create({
          data: newUser,
        })
        const token = generateToken(userEntered.email)
        const tokenEntered = await prisma.token.create({
          data: {
            userId: 1,
            token,
          },
        })
        if (userEntered) {
          await verifyUserMail(userEntered, token, req, res)
        }
        res.redirect('/users/signupAck')
      } catch (error) {
        console.log(error.message)
        res.render('signup', [{ msg: error.message }])
      }
    }
  } catch (error) {
    console.log(error.message)
    res.render('signup', [{ msg: error.message }])
  }
}

//--user email varification

const verification = async (req, res) => {
  const email = req.query.email
  const token = req.query.token
  try {
    const userExist = await prisma.user.findUnique({
      where: {
        email,
      },
    })
    if (!userExist) {
      res.render('emailverification', [
        { msg: 'Email not found' },
        { token, email },
      ])
    }

    const update = await prisma.user.update({
      where: {
        email,
      },
      data: {
        isVerified: true,
      },
    })
    res.redirect('/users/signin')
  } catch (error) {
    res.render('emailverification', [{ msg: error.message }, { token, email }])
  }
}

//--- login post function
const signin = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const alert = errors.array()
      res.render('login', { alert })
    } else {
      const { email, password } = req.body
      const userExist = await prisma.user.findUnique({
        where: { email },
      })
      const matchPassword = bcrypt.compare(password, userExist.password)
      if (!userExist && !matchPassword) {
        const alert = [
          {
            msg: 'Invalid email or password',
          },
        ]
        res.render('login', { alert })
      }

      const expiration = process.env.DB_ENV === 'testing' ? 100 : 604800000
      const token = await generateToken(userExist.id)
      res.cookie('jwt', token, {
        expires: new Date(Date.now() + expiration),
        secure: false,
        httpOnly: true,
      })
      res.header('Authorization', 'Bearer ' + token)
      res.redirect('/dashboard')
    }
  } catch (error) {
    const alert = [{ msg: 'Invalid email or password' }]
    res.render('login', { alert })
  }
}

const getUserPosts = async (req, res) => {
  try {
    const result = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        post: true,
      },
    })
    res.status(200).send(result)
  } catch (error) {
    res.status(400).send({ message: error.message })
  }
}

//--- @desc : user details info
///method :GET
const getUserDetails = async (req, res) => {
  const token = req.cookies.jwt || ''
  const decode = jwt.verify(token, 'secret')
  let userData = {
    firstname: '',
    lastname: '',
    email: '',
    isVerified: '',
    username: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    about_me: '',
    avatar: '',
  }
  try {
    const userInfo = await prisma.user.findUnique({
      where: {
        id: decode.id,
      },
      select: {
        firstname: true,
        lastname: true,
        email: true,
        isVerified: true,
      },
    })
    const userProfile = await prisma.user_profile.findUnique({
      where: {
        user_id: decode.id,
      },
      select: {
        username: true,
        address: true,
        city: true,
        state: true,
        postal_code: true,
        about_me: true,
        avatar: true,
      },
    })
    const userDetails = { ...userInfo, ...userProfile }
    if (!userInfo) {
      res.render('userprofile', { error: 'User Not Found', user: userData })
    }
    res.render('userprofile', { user: userDetails })
  } catch (error) {
    console.log(error.message)
    res.render('userprofile', { error: error.message, user: userData })
  }
}
//-- @desc :update user profile --
//--method:POST
const profile = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    res.render('userprofile', {
      user: req.body,
      error: 'No files were uploaded.',
    })
  }
  let userData = {
    firstname: '',
    lastname: '',
    email: '',
    isVerified: '',
    username: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    about_me: '',
    avatar: '',
  }
  try {
    const token = req.cookies.jwt || ''
    const decode = await jwt.verify(token, 'secret')
    const { name, data, mimetype } = req.files.avatar
    const userInput = {
      user_id: decode.id,
      username: req.body.username,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      postal_code: parseInt(req.body.postal_code),
      about_me: req.body.about_me,
      avatar: data,
      avatar_name: name,
      mime_type: mimetype,
    }
    //console.log(userInput)
    const userExist = await prisma.user_profile.findUnique({
      where: {
        user_id: decode.id,
      },
    })

    let userEntered
    if (userExist) {
      userEntered = await prisma.user_profile.update({
        where: {
          user_id: decode.id,
        },
        data: userInput,
      })
    } else {
      userEntered = await prisma.user_profile.create({ data: userInput })
    }
    if (!userEntered) {
      res.render('userprofile', {
        user: req.body,
        error: 'Profile not updated!. Plz fill correct data',
      })
    }
    res.redirect('/users/profileInfo')
  } catch (error) {
    res.render('userprofile', { user: req.body, error: error.message })
  }
}

//--- @desc :  User Profile Details
//-- method  :GET
const getUserProfile = async (req, res) => {
  const token = req.cookies.jwt || ''
  const decode = jwt.verify(token, 'secret')

  const userData = {
    firstname: '',
    lastname: '',
    email: '',
    isVerified: '',
    username: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    about_me: '',
    avatar: '',
    avatar_name: '',
    mime_type: '',
  }

  try {
    const userInfo = await prisma.user.findUnique({
      where: {
        id: decode.id,
      },
      select: {
        firstname: true,
        lastname: true,
        email: true,
        isVerified: true,
        user_profile: {
          select: {
            username: true,
            address: true,
            city: true,
            state: true,
            postal_code: true,
            about_me: true,
            avatar: true,
            avatar_name: true,
            mime_type: true,
          },
        },
        post: {
          select: {
            title: true,
            body: true,
          },
        },
        comment: {
          select: {
            comment: true,
          },
        },
      },
    })
    if (!userInfo) {
      console.log('No user profile found')
      res.render('profileInfo', { error: 'User Not Found', user: userData })
    }
    console.log(userInfo)
    res.render('profileInfo', { user: userInfo })
  } catch (error) {
    res.render('profileInfo', { error: error.message, user: userData })
  }
}

const logout = async (req, res) => {}
module.exports = {
  signin,
  getAllUsers,
  signup,
  getUserPosts,
  logout,
  verification,
  profile,
  getUserProfile,
  getUserDetails,
}
