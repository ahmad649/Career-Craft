require('dotenv').config();
const userModel = require('../models/userModel');
const studentModel = require('../models/studentModel');
const jobModel = require('../models/jobModel')
const mongoose = require('mongoose')
const fs = require('fs');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const corresponding_skills= require("./../extras/corresponding_skills.json")
const JWT_SECRET = process.env.JWT_SECRET_KEY

// create a new user
const getStudentProfile = async (req, res) => {
    console.log("getStudentProfile called")
    try {
        const { token, accountType } = req.headers

        if (!token) {
            res.status(401).json({ message: 'Token is missing' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        
        const student = await studentModel.findOne({ user: decoded.id })
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        try{
            const resumePath = `resumes/${student.resume}`;
            const resume = await fs.promises.readFile(resumePath, { encoding: 'base64' });
            student.resume = `data:application/pdf;base64,${resume}`;
        }
        catch(err){
            student.resume = null
            console.log("file not found")
        }
        return res.status(200).json(student);

    } catch (err) {
        res.status(401).json({ message: err });
    }


}

const setStudentProfile = async (req, res) => {

    console.log("set recruiter profile called")
    try {
        const { token, accountType } = req.headers

        if (!token) {
            res.status(401).json({ message: 'Token is missing' });
        } 

        const decoded = jwt.verify(token, JWT_SECRET);

        
        // Check if the resume property exists in the request body
        if (req.body.resume) {

            // if (!req.body.resume.match(/^data:application\/pdf;base64,/)) {
            //     return res.status(400).json({ status: 'error', error: 'Invalid file format, only pdf files are allowed' });
            // }
            // decode the base64 encoded string
            const base64Data = req.body.resume.split(';base64,').pop();
            // specify a file name and path to save the file
            const fileName = `${Date.now()}_${req.body.fname}.pdf`;
            await fs.promises.writeFile(`resumes/${fileName}`, base64Data.toString(), {encoding: 'base64'});

            req.body.resume = fileName;

            await studentModel.updateOne({ user: decoded.id }, { $set: req.body });
            return res.status(200).json({ status: 'ok', message: 'we goooood !!!!' });
        }else{
            return res.status(400).json({status: 'error', error: 'No resume uploaded'});
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({ status: 'error', error: err });
    }
}


const getCareerPathInfo = async(req,res) => {
    console.log("made it to getCareerPathInfo")
    try {
        const {token, accountType} = req.headers
        const {keyword} = req.body
        
        if (!token) {
            res.status(401).json({ message: 'Token is missing' });
        }
        const decoded = jwt.verify(token, JWT_SECRET);

        const params = new URLSearchParams({path_name: keyword}); // convert skills array to comma-separated string
        const response = await fetch(`http://127.0.0.1:5000/careerpathdetail?${params.toString()}`);
        if (!response.ok) {
            throw new Error(`Prediction service responded with error code ${response.status}`);
        }
        
        const data = await response.json();
        

        res.status(200).json({ status: 'ok', data: data['info']});



    } catch (err) {
        console.error(err)
        res.status(500).json({ status: 'error', error: err });
    }
}


const getPotentialPaths = async (req,res)=>{
    console.log("made it to the controller")
    // const careerPaths = [{'path':'Python developer','info':'a python developer is someone who develops programs using the python language'},{'path':'Devops Engineer','info':'A DevOps engineer introduces processes, tools, and methodologies to balance needs throughout the software development life cycle, from coding and deployment, to maintenance and updates.'},{'path':'Full stack developer','info':'a full stack developers is responsible for development of both frontend and backend of an application'},{'path':'java developer','info':'a java developer is someone who develops programs using the java language'},{'path':'.Net Developer','info':'NET developer is a software engineer who builds the software using Microsoft\'s . NET technologies'}]
    var careerPaths = []
    
    try {
        const { token, accountType } = req.headers
        if (!token) {
            res.status(401).json({ message: 'Token is missing' });
        }
        const decoded = jwt.verify(token, JWT_SECRET);

        const student = await studentModel.findOne({ user: decoded.id }).select('skills');
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        

        const params = new URLSearchParams({ skills: student.skills.join(',') }); // convert skills array to comma-separated string
        const response = await fetch(`http://127.0.0.1:5000/careerpathprediction?${params.toString()}`);
        if (!response.ok) {
            throw new Error(`Prediction service responded with error code ${response.status}`);
        }
        
        const careerPaths = await response.json();
    
        res.status(200).json({ status: 'ok career paths', data: careerPaths, skills: student.skills });

    } catch (err) {
        console.error(err)
        res.status(500).json({ status: 'error', error: err });
    }

}



const getRankedJobs = async(req,res) =>{

    try {
        const { token, accountType} = req.headers
        const { studentSkills } = req.body
        if(!studentSkills){
            return res.status(401).json({ message: 'skills missing'});
        }

        if (!token) {
            return res.status(401).json({ message: 'Token is missing'});
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        var jobs = await jobModel.find({}).select('-_id job_title job_type job_location salary_range job_description skills')

        jobs.sort((jobA, jobB) => {
            const aMatchingSkills = jobA.skills.filter(skill => studentSkills.includes(skill)).length;
            const bMatchingSkills = jobB.skills.filter(skill => studentSkills.includes(skill)).length;
            return bMatchingSkills - aMatchingSkills;
            // if (aMatchingSkills === bMatchingSkills) {
            //   // If the number of matching skills is the same, sort by proximity to job location
            //     const aDistance = getDistance(profileA.location, jobLocation);
            //     const bDistance = getDistance(profileA.location, jobLocation);
            //     return aDistance - bDistance;
            // } else {
            //   // Sort by number of matching skills
            //     return bMatchingSkills - aMatchingSkills;
            // }
        });


        // return res.status(200).json({ status: 'ok'})
        return res.status(200).json({ status: 'ok', data:jobs})

    } catch (err) {
        console.error(err)
        return res.status(500).json({ status: 'error', error: err });
    }

    // res.status(200).json({ status: 'ok jobs', data:["hello","mello","bello"]});
}


const getRelevantSkills = async(req,res) =>{

    var relevant_skills=['ADOBE AFTER EFFECTS', 'FIGMA','ADOBE XD', 'ADOBE PHOTOSHOP', '3D DESIGNER',  'DIVINCI RESOLVE']
    try {
        const { token, accountType, keyword} = req.headers
        console.log("path name1  : ",keyword)

        if (!token) {
            res.status(401).json({ message: 'Token is missing' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const newSkills = corresponding_skills.filter((value) => {
            // if (value.JOB_TITLE==keyword){
            //     console.log(value)

            // }
            return (value.JOB_TITLE.includes(keyword))
        });
        tempSkills = newSkills[0].SKILLS
        relevant_skills = tempSkills.split(', ')
        
        console.log(tempSkills)
        console.log(relevant_skills)

        // res.status(200).json({ status: 'ok career paths'});
        res.status(200).json({ status: 'ok relevant fields', relevantskills: relevant_skills });


        // const params = new URLSearchParams({ skills: student.skills.join(',') }); // convert skills array to comma-separated string
        // const response = await fetch(`http://127.0.0.1:5000/careerpathprediction?${params.toString()}`);
        // if (!response.ok) {
        //     throw new Error(`Prediction service responded with error code ${response.status}`);
        // }
        // const careerPaths = await response.json();

    } catch (err) {
        console.error(err)
        res.status(500).json({ status: 'error', error: err });
    }

}



module.exports = { getStudentProfile, setStudentProfile, getPotentialPaths, getRelevantSkills, getRankedJobs, getCareerPathInfo}