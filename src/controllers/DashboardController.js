const jwt = require('jsonwebtoken')
const index = async (req, res) => {
  res.render('dashboard', { user: req.user })
}

module.exports = { index }
