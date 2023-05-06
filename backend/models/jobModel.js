const mongoose = require('mongoose');
const recruiter = require('./recruiterModel');
const Schema = mongoose.Schema

const jobSchema = new Schema({

    recruiter:{
        type: mongoose.Schema.Types.ObjectId,
        ref: recruiter
    },
    job_title:{
        type: String,
        requried: true,
    },
    job_type:{
        type: String,
        requried: true,
    },
    job_location:{
        type: String,
        requried: true,
    },
    salary_range:{
        type: String,
        requried: true,
    },
    job_description:{
        type: String,
        requried: true,
    },
    skills:[{
        type: String,
    }],

},{timestamps: true})

module.exports = mongoose.model('Job',jobSchema);

