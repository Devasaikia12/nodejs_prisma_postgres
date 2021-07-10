const { body } = require('express-validator')

const signupValidator = [
  body('firstname')
    .trim()
    .not()
    .isEmpty()
    .withMessage('First name can not be empty!')
    .bail()
    .isLength({ min: 3 })
    .withMessage('Minimum 3 characters required!')
    .bail(),
  body('lastname')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Last name can not be empty!')
    .bail()
    .isLength({ min: 3 })
    .withMessage('Minimum 3 characters required!')
    .bail(),
  body('email')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Email can not be empty!')
    .bail()
    .isEmail()
    .withMessage('Invalid email address!')
    .bail(),
  body('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Password can not be empty!')
    .bail()
    .isString()
    .isLength({ min: 3 })
    .withMessage('Minimum 3 characters')
    .bail(),
  body('cpassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password')
    }
    return true
  }),
]

const signinValidator = [
  body('email')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Email can not be empty!')
    .bail()
    .isEmail()
    .withMessage('Invalid email address!')
    .bail(),
  body('password')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Password can not be empty!')
    .bail()
    .isString()
    .isLength({ min: 3 })
    .withMessage('Minimum 3 characters')
    .bail(),
]

module.exports = { signupValidator, signinValidator }
