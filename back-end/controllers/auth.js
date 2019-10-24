const express = require('express')
const controller = express.Router()
const jwt = require("jsonwebtoken");
const expressJwt = require('express-jwt');
const nodeMailer = require('nodemailer');
const shortId = require('shortid')
require("dotenv").config();

const User = require('../models/user')

controller.signup = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email }).exec();
        if (user) {
            return res.status(400).json({
                error: "Cet adresse e-mail existe déja"
            });
        } else {
            const { name, email, password } = req.body;
            let username = shortId.generate();
            let profile = `${process.env.CLIENT_URL}/profile/${username}`; 
            let newUser = new User({ name, email, password, profile, username });
            await newUser.save(); 
            return res.json({
                message: 'Signup success! Please signin.'
            }); 
        }
    }
    catch (err) {
        return console.log(err);
    }
};

controller.signin = async (req, res) => {
    const{email, password} = req.body
    try {
        const user = await User.findOne({email}); 
        if(!user || !user.authenticate(password)) {
            return res.status(400).json({
                error: "Mauvais identifiant ou mot de passe"
            })   
        }
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET)
        res.cookie('t', token, {expire: new Date() + 9999})
        const {_id, username, name, role} = user
        return res.json({token, user: {_id, username, name, email, role}
        });
    }
    catch (err) {
        return console.log(err);
    }   
}

controller.signout = (req, res) => {
    res.clearCookie("t");
    return res.json({ message: "Vous avez été déconnecté"})
}

controller.requireSignIn = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: "auth"
})

controller.isAuth = async (req, res, next) => {
    try {
        const authUserId = req.auth._id
        const user = await User.findById({_id: authUserId}).exec(); 
        if(!user) {
            return res.status(400).json({
                error: 'Aucun utilisateur trouvé'
            })
        }
        req.profile = user
        next();
    }
    catch (err) {
        return console.log(err);
    }      
}

controller.isAdmin = async (req, res, next) => {
    try {
        const adminUserId = req.auth._id
        const  user = await User.findById({_id: adminUserId}).exec(); 
        if(!user) {
            return res.status(400).json({
                error: 'Aucun utilisateur trouvé'
            })
        }
        if(user.role != 1) {
            return res.status(400).json({
                error: 'Aucun utilisateur trouvé'
            })   
        }
        req.profile = user
        next();
    }
    catch (err) {
        return console.log(err);
    }      
}



module.exports = controller;