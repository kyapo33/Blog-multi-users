const express = require('express')
const slugify = require('slugify')
const controller = express.Router()
require("dotenv").config();

const Category = require('../models/category')

controller.create = async (req, res) => {
    try {
        const {name} = req.body
        let slug = slugify(name).toLowerCase()
        let category = new Category({name, slug})
        const data = await category.save();
        return res.json({data})
    }
    catch (err) {
        return res.status(400).json({
            error: 'La création de la catégorie a échoué'
        })   
    }       
}

controller.list = async (req, res) => {
    try {
        const data  = await Category.find().exec()
        return res.json(data)
    }
    catch (err) {
        return res.status(400).json({
            error: 'Aucune catégorie trouvée'
        })   
    }  
}

controller.read = async (req, res) => {
    const slug = req.params.slug.toLowerCase()
    try {
        const category = await Category.findOne({ slug }).exec();
        return res.json({ category });
    }
    catch (err) {
        return res.status(400).json({
            error: 'Catégorie non trouvé'
        }) 
    }
};

controller.remove = async (req, res) => {
    const slug = req.params.slug.toLowerCase()
    try {
        await Category.findOneAndRemove({ slug })
        return res.json({ 
            message: "La catégorie a bien été supprimé"
        }); 
    }
    catch (err) {
        return res.status(400).json({
            error: "Suppression échoué"
        })   
    }
}

module.exports = controller;