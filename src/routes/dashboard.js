const router = require('express').Router()
const auth = require('../middleware/authMiddleware')
const { index } = require('../controllers/DashboardController')
router.get('/', auth, index)

module.exports = router
