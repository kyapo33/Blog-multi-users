const express = require('express')
const router = express.Router()

const auth = require('../controllers/auth') 
const {signupValidator} = require("../validator");


router.post('/signup', signupValidator, auth.signup)
router.post('/signin', auth.signin)
router.get('/signout', auth.signout)

router.get('/secret', auth.requireSignIn, (req, res) => {
    res.json({
        user: req.auth
    })
})

module.exports = router