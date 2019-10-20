const express = require('express')
const controller = express.Router()
require("dotenv").config();

const User = require('../models/user')

controller.read = (req, res) => {
    req.profile.hash_password = undefined;
    return res.json(req.profile);
}




module.exports = controller;