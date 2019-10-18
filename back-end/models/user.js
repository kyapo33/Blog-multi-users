const mongoose = require('mongoose')
const crypto = require('crypto')
const uuidv1 = require('uuid/v1')

const userSchema = new mongoose.Schema({
    username : {
        type: String,
        trim: true,
        required: true,
        index: true,
        lowercase: true
    },

    name : {
        type: String,
        trim: true,
        required: true,
    },

    email : {
        type: String,
        trim: true,
        required: true,
        unique: true
    },

    profile : {
        type: String,
        required: true   
    },

    hashed_password : {
        type: String,
        required: true,
    },
    salt : String,

    about: {
        type: String
    },

    role: {
        type: Number,
        trim: true
    },

    photo: {
        data: Buffer,
        contentType: String
    },

    resetPasswordLink: {
        data: String,
        default: ""
    }

}, {timestamps : true});

userSchema.virtual("password")
    .set(function(password) {
        this._password = password;
        this.salt = uuidv1();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

    userSchema.methods = {
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    encryptPassword: function(password) {
        if (!password) return "";
        try {
            return crypto
                .createHmac("sha1", this.salt)
                .update(password)
                .digest("hex");
        } catch (err) {
            return "";
        }
    }
};

module.exports = mongoose.model('User', userSchema);