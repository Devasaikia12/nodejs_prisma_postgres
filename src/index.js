const express = require('express')
const path = require('path')
const moment = require('moment')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const expressLayout = require('express-ejs-layouts')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { PrismaSessionStore } = require('@quixo3/prisma-session-store')
const dotenv = require('dotenv')
const passport = require('passport')
const HttpsProxyAgent = require('https-proxy-agent');

dotenv.config()
//--route files import
const userRoute = require('./routes/user.js')
const postRoute = require('./routes/post')
const dashboardRoute = require('./routes/dashboard')

//-- app setup
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(fileUpload())
app.locals.moment = moment
app.locals.path = process.env.SERVER_PATH
app.locals.uploadDir = process.env.basedir

//--- express session with prisma setup to databse--
app.use(
  session({
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
    secret: 'prisma session',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false, maxAge: 1 * 24 * 60 * 60 * 1000 },
  })
)

//  app to use passport settings
app.use(passport.initialize())
app.use(passport.session())
require('./services/passport-google')(passport)

//--- setting ejs thml template --
app.set('view engine', 'ejs')
app.set('views', [
  path.join(__dirname, '../views/'),
  path.join(__dirname, '../views/partials/'),
  path.join(__dirname, '../views/partials/public/'),
  path.join(__dirname, '../views/partials/auth/'),
  path.join(__dirname, '../views/dashboard/'),
  path.join(__dirname, '../views/user/'),
  path.join(__dirname, '../views/post/'),
])
// Static Middleware
app.use(express.static('public'))

//Parse URL-encoded bodies
app.use(express.urlencoded({ extended: false }))
//---routes start here--

app.get('/', async (req, res) => {
  //console.log(req.cookies.jwt)
  // let token = req.cookies.jwt || ''
  // //console.log(token)
  // if (token) {
  //   //token = token.token
  //   const decode = await jwt.verify(token, 'secret')
  //   console.log(decode)
  //   if (decode.id) {
  //     res.redirect('/dashboard')
  //   }
  // } else {
    res.render('index')
  //}
})
app.use('/auth', require('./routes/auth'))
app.use('/users', userRoute)
app.use('/posts', postRoute)
app.use('/dashboard', dashboardRoute)

//--server running
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log('Server is running on port 5000')
})
