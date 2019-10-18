const express = require('express')
const controller = express.Router()

controller.time = (req, res) => {
    res.json({time: Date().toString()})
}

module.exports = controller
