const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const auth = async (req, res, next) => {
  const token = req.cookies.jwt || ''
  try {
    const decode = await jwt.verify(token, 'secret')
    const userdetails = await prisma.user.findUnique({
      where: { id: decode.id },
      select: {
        email: true,
        firstname: true,
        lastname: true,
      },
    })
    req.user = userdetails
    next()
  } catch (error) {
    return res.status(400).send({ message: 'Not authorize,token failed' })
  }
}

module.exports = auth
