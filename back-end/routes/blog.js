const express = require('express')
const router = express.Router()

const blog = require('../controllers/blog')
const auth = require('../controllers/auth') 


router.post('/create/blog', auth.requireSignIn, auth.isAdmin, blog.create);


module.exports = router