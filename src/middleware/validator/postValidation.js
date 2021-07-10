const { body } = require('express-validator')

const validator = [
  body('title')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Title filed is requied')
    .bail()
    .isLength({ min: 5 })
    .withMessage('At least 5 character long')
    .bail(),
  body('body')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Title filed is requied')
    .bail()
    .isLength({ min: 10 })
    .withMessage('At least 10 character long')
    .bail(),
]

module.exports = { validator }
