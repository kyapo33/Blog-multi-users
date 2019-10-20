const express = require('express')
const router = express.Router()

const auth = require('../controllers/auth') 
const user = require('../controllers/user') 



router.get('/profile', auth.requireSignIn, auth.isAuth, user.read)

module.exports = router