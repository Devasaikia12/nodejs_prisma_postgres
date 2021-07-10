const Joi = require('joi')

const signupValidation = (data) => {
  const schema = Joi.object()
    .keys({
      name: Joi.string().min(6).required(),
      email: Joi.string().min(6).email().required(),
      password: Joi.string().min(6).required(),
    })
    .options({ abortEarly: false })

  return schema.validate(data)
}

module.exports = { signupValidation }
