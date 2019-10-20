const express = require('express')
const router = express.Router()

const category = require('../controllers/category') 
const auth = require('../controllers/auth') 
const user = require('../controllers/user') 
const {categoryValidator} = require("../validator");


router.post('/create/category', categoryValidator, auth.requireSignIn, auth.isAdmin, category.create)
router.get('/category/:slug', category.read);
router.delete('/category/:slug', auth.requireSignIn, auth.isAdmin, category.remove);
router.get('/category', category.list);

module.exports = router