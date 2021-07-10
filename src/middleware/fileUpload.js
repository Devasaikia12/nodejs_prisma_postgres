// var multer = require('multer')
// const path = require('path')

// const storage = multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, path.join(__dirname, '../../uploads/'))
//   },
//   filename: function (req, file, callback) {
//     callback(null, file.fieldname + '_' + Date.now() + '_' + file.originalname)
//   },
// })

// const upload = multer({
//   storage: storage,
//   fileFilter: (req, file, cb) => {
//     if (
//       file.mimetype == 'image/png' ||
//       file.mimetype == 'image/jpg' ||
//       file.mimetype == 'image/jpeg' ||
//       file.mimetype == 'image/gif'
//     ) {
//       cb(null, true)
//     } else {
//       cb(null, false)
//       return cb(new Error('Allowed only .png, .jpg, .jpeg and .gif'))
//     }
//   },
// })

// module.exports = upload
