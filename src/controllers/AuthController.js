const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const generateToken = require('../uttils/generateToken')

const findAndCreateUserProfile = async (req, res)=> {
    //console.log('redirected', req.user)
    const email =  req.user.emails.find(email => email.varified || req.user.emails[0])
    try{
      const userdata = {
        firstname: req.user.name.givenName,
        email: email.value,
        lastname : req.user.name.familyName,
        password: '',
      }


      //console.log(userdata)
      let user = await prisma.user.findUnique({where : {email : email.value}})

      if(!user){
        user = await prisma.user.create({data : userdata});

        // const user_profile = {
        // 	user_id : user.id,
        // 	name : req.user.displayName,
        // 	avatar : req.user.
        // }
      }

      const expiration = process.env.DB_ENV === 'testing' ? 100 : 604800000
      const token = await generateToken(user.id)
    
      res.cookie('jwt', token,{
        expires: new Date(Date.now() + expiration),
        secure :false,
        httpOnly : true,
      })
      res.header('Authorization', 'Bearer ' + token)

    }catch(error){
      console.log(error)    
    }

    res.redirect('/dashboard')
}

module.exports = { findAndCreateUserProfile }