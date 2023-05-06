const mongoose = require('mongoose');
const user = require('./userModel');
const Schema = mongoose.Schema


const recruiterSchema = new Schema({

    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: user
    },
    fname:{
        type: String,
        requried: true,
    },
    lname:{
        type: String,
        requried: true,
    },
    cnic:{
        type: String,
        requried: true,
    },
    prefferedEmail:{
        type: String,
        requried: true,
    },
    currentPosition:{
        type: String,
        requried: true,
    },
    companyLogo:{
        type: String,
    },
    companyName:{
        type: String,
        requried: true,
    },
    companyLocation:{
        type: String,
        requried: true,
    },
    dateEstablished:{
        type: String,
        requried: true,
    },
    domainOfWork:{
        type: String,
        requried: true,
    },
    numberOfWorkers:{
        type: Number,
        requried: true,
    },

},{timestamps: true})

module.exports = mongoose.model('Recruiter',recruiterSchema);

