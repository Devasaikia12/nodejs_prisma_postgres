const jwt = require('jsonwebtoken')
const path = require('path')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

//--- @desc: function  to get all post of a user
//--- method : GET
const getUserPost = async (req, res) => {
  const token = req.cookies.jwt || ''
  const decode = await jwt.verify(token, 'secret')
  try {
    const posts = await prisma.post.findMany({
      where: {
        author: decode.id,
      },
      select: {
        id: true,
        title: true,
        body: true,
        image_name: true,
        createdAt: true,
        published: true,
      },
    })
    console.log(posts)
    res.render('userPost', { posts })
  } catch (error) {
    res.render('userPost', { error: error.message })
  }
}

//--- @desc: function  to create a new post
const getPostForm = async (req, res) => {
  let postData = {
    formTitle: 'Create Post',
    title: '',
    body: '',
    btnTitle: 'Create',
  }
  res.render('postForm', { post: postData })
}

//--- method : POST
const createPost = async (req, res) => {
  let postData = {
    formTitle: 'Create Post',
    btnTitle: 'Create',
  }
  if (!req.files || Object.keys(req.files).length === 0) {
    res.render('postForm', {
      post: { ...postData, ...req.body },
      error: 'No files were uploaded.',
    })
  }
  try {
    const token = req.cookies.jwt || ''
    const decode = await jwt.verify(token, 'secret')
    const { title, body, published } = req.body
    const { name, mimetype } = req.files.image
    const filename = new Date().getTime() + '_' + name
    const data = {
      title,
      body,
      author: decode.id,
      published: published == 'on' ? true : false,
      image_name: filename,
      mime_type: mimetype,
    }
    console.log(data)
    const newPost = await prisma.post.create({
      data,
    })
    if (newPost) {
      try {
        const uploadPath = path.join(__dirname, '../../uploads/') + filename
        req.files.image.mv(uploadPath, function (err) {
          if (err) return res.status(500).send(err)
          console.log('File uploaded!')
        })
      } catch (error) {
        console.log(error.message)
      }
      res.redirect('/posts/userPost')
    }
  } catch (error) {
    console.log(error.message)
    res.render('postForm', {
      post: { ...postData, ...req.body },
      error: error.message,
    })
  }
}

//---- @desc: function to get individual post
const getPost = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const post = await prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        body: true,
        image_name: true,
        createdAt: true,
        published: true,
      },
    })
    res.status(200).json(post)
  } catch (error) {
    res.status(400).send({ error: error.message })
  }
}
module.exports = { createPost, getUserPost, getPostForm, getPost }
