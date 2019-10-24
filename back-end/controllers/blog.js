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

controller.list = async(req, res) => {
    try {
        const data = await Blog.find()
            .populate('categories', '_id name slug')
            .populate('postedBy', '_id name username')
            .select('_id title slug excerpt categories postedBy createdAt updateAt')
            .exec(); 
        return res.send(data)        
    }
    catch (err) {
        return res.status(400).json({
            error: 'Aucun blogs trouvés'
        })
    }    
}

controller.listAllBlogsCategories = async(req, res) => {
    let limit = req.body.limit ? parseInt(req.body.limit): 10;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0
    let blogs
    let categories
    try {
        const data = await Blog.find()
            .populate('categories', '_id name slug')
            .populate('postedBy', '_id name username')
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limit)
            .select('_id title slug excerpt categories postedBy createdAt updateAt')
            .exec(); 
        blogs = data
        const c = await Category.find().exec()
        categories = c
        return res.json({blogs, categories, size: blogs.length})
    } 
    catch (err) {
        return res.status(400).json({
            error: 'Aucun blogs trouvés'
        })
    }       
}

controller.read = async(req, res) => {
    const slug = req.params.slug.toLowerCase()
    try {
        const data = await Blog.findOne({slug})
        .populate('categories', '_id name slug')
        .populate('postedBy', 'name')
        .select('_id title body slug mtitle mdesc categories postedBy createdAt updateAt')
        .exec()
        return res.json(data)
    }  
    catch (err) {
        return res.status(400).json({
            error: 'Aucun blogs trouvés'
        })
    }   
}

controller.remove = async(req, res) => {
    const slug = req.params.slug.toLowerCase()
    try {
        await Blog.findOneAndRemove({slug}).exec();
        return res.json({ 
            message: "L'article a été supprimé'"
        }); 
    }
    catch (err) {
        return res.status(400).json({
            error: 'La suppression a échoué'
        })
    }  
}

controller.edit = async (req, res) => {
    const slug = req.params.slug.toLowerCase()
    try {
        const oldBlog = await Blog.findOne({slug}).exec();
        let form = new formidable.IncomingForm();
        form.keepExtensions = true;
        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.status(400).json({
                    error: 'Le chargement de l\'image a échoué'
                })
            }
            let oldSlug = oldBlog.slug;
            _.merge(oldBlog, fields);
            oldBlog.slug = oldSlug
            const {body, desc, categories} = files
            if (body) {
                oldBlog.excerpt = smartTrim(body, 320, ' ', ' ...'); 
                oldBlog.desc = stripHtml(body.substring(0, 160))
            }
            if (categories) {
                oldBlog.categories = categories.split(',');
            }

            if(files.photo) {
                if(files.photo.size > 10000000) {
                    return res.status(400).json({
                        error: 'La photo est trop grande'
                    })   
                } 
                oldBlog.photo.data = fs.readFileSync(files.photo.path)
                oldBlog.photo.contentType = files.photo.type 
            }
            const result = await oldBlog.save()
            return res.json(result)    
        })
    }
    catch (err) {
        return res.status(400).json({
            error: 'La mise a du blog a échoué'
        })   
    }      
}

controller.photo = async(req, res) => {
    const slug = req.params.slug.toLowerCase()
    try {
        const blog = await Blog.findOne({slug})
        .select('photo')
        .exec();
        res.set('Content-Type', blog.photo.contentType)
        return res.send(blog.photo.data)
    }
    catch (err) {
        return res.status(400).json({
            error: 'Image indisponible'
        })
    }  
}

module.exports = controller
