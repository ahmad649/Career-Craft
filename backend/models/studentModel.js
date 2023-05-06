const mongoose = require('mongoose');
const user = require('./userModel');
const Schema = mongoose.Schema

const studentSchema = new Schema({
    
    //fname,lname,cnic,city,preffered email,phonenumber,profilestatus(boolean), resume file itself,highest level of edu, institute name, grade/cgpa, 
    //skills, workexperience, achievements 
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
    city:{
        type: String,
        requried: true,
    },
    prefferedEmail:{
        type: String,
        requried: true,
    },
    phone:{
        type: String,
    },
    resume:{
        type: String,
    },
    highest_level_of_education:{
        type: String,
    },
    institute_name:{
        type: String,
    },
    cgpa:{
        type: String,
    },
    skills:[{
        type: String,
    }],
    work_experience: [{
        job_title:{type: String},
        company_name:{type: String},
        duration:{type: String},
        job_description:{type: String},
    }],
    achievements: [{
        achievement_name:{type: String},
        year:{type: String},
        achievement_description:{type: String},
    }],
    profileStatus:{
        type: Boolean,
        requried: true,
    },
    // need to implement the others later too
},{timestamps: true})

module.exports = mongoose.model('Student',studentSchema);

