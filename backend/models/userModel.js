const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema({
    email:{
        type: String,
        requried: true,
        unique: true
    },
    password:{
        type: String,
        requried: true
    },
    accountType:{
        type: Boolean,
        requried: true
    },
    termsAndConditions:{
        type: Boolean,
        requried: true
    }

},{timestamps: true})

module.exports = mongoose.model('User',userSchema);

