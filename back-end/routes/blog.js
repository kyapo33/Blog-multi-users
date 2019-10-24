const express = require('express')
const router = express.Router()

const blog = require('../controllers/blog')
const auth = require('../controllers/auth') 


router.post('/create/blog', auth.requireSignIn, auth.isAdmin, blog.create);
router.get('/blogs', blog.list);
router.post('/blogs-categories', blog.listAllBlogsCategories);
router.get('/blog/:slug', blog.read);
router.delete('/blog/:slug', auth.requireSignIn, auth.isAdmin, blog.remove);
router.put('/edit/blog/:slug', auth.requireSignIn, auth.isAdmin, blog.edit);
router.get('/blog/photo/:slug', blog.photo);

module.exports = router