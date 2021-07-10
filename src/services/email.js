const nodemailer = require('nodemailer')
const sgTransport = require('nodemailer-sendgrid-transport')
const generateToken = require('../uttils/generateToken')
const options = {
  auth: {
    api_key:
      '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',
  },
}

const mailer = nodemailer.createTransport(sgTransport(options))
const verifyUserMail = (user, token, req, res) => {
  const link = `http://${req.headers.host}/users/verification?token=${token}&email=${user.email}`
  console.log(link)
  const msg = {
    to: user.email,
    from: 'saikiadeva12@outlook.com',
    subject: `Hi ${user.firstname}`,
    text: 'Welcome to the app.',
    html: `<p>Hi ${user.firstname}<p><br><p>Please click on the following <a href="${link}">link</a> to verify your account.</p>
    <br><p>If you did not request this, please ignore this email.</p>`,
  }
  mailer
    .sendMail(msg)
    .then(() => {
      console.log('Email Sent')
    })
    .catch((error) => {
      console.log(error)
    })
}

module.exports = { verifyUserMail }
