const express = require('express')
const controller = express.Router()
const formidable = require('formidable')
const slugify = require('slugify')
const stripHtml = require('string-strip-html')
const _ = require('lodash')
const fs = require('fs')
const { smartTrim } = require('../helpers/blog');

const Blog = require('../models/blog')
const Category = require('../models/category')



controller.create = async (req, res) => {
    try {
        let form = new formidable.IncomingForm();
        form.keepExtensions = true;
        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.status(400).json({
                    error: 'Le chargement de l\'image a échoué'
                })
            }
            const {title, body, categories} = fields

            if (!title || !title.length) {
                return res.status(400).json({
                    error: 'Un titre est requis'
                });
            }
            
            if (!body || body.length < 200) {
                return res.status(400).json({
                    error: 'Le contenu est cours'
                });
            }
            
            if (!categories || categories.length === 0) {
                return res.status(400).json({
                    error: 'Au moins une catégories est requise'
                });
            }
    
            let blog = new Blog()
            blog.title = title
            blog.body = body
            blog.excerpt = smartTrim(body, 320, ' ', ' ...');
            blog.slug = slugify(title).toLowerCase()
            blog.mtitle = `${title} - ${process.env.APP_NAME}`
            blog.mdesc = stripHtml(body.substring(0, 160))
            blog.postedBy = req.auth._id
            let arrayOfCategories = categories && categories.split(',');

            if(files.photo) {
                if(files.photo.size > 10000000) {
                    return res.status(400).json({
                        error: 'La photo est trop grande'
                    })   
                } 
                blog.photo.data = fs.readFileSync(files.photo.path)
                blog.photo.contentType = files.photo.type 
            }
            await blog.save()
            const result = await Blog.findByIdAndUpdate(blog._id, { $push: { categories: arrayOfCategories } }, { new: true }).exec();
            return res.json(result)    
        })
    }
    catch (err) {
        return res.status(400).json({
            error: 'La création du blog a échoué'
        })   
    }      
}

module.exports = controller
