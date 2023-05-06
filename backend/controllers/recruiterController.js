require('dotenv').config();
const userModel = require('../models/userModel');
const studentModel = require('../models/studentModel');
const recruiterModel = require('../models/recruiterModel');
const jobModel = require('../models/jobModel');
const multer = require('multer')
const mongoose = require('mongoose')
const fs = require('fs');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { profile } = require('console');



const JWT_SECRET = process.env.JWT_SECRET_KEY

// create a new user
const getRecruiterProfile = async (req, res) => {
    console.log("getRecruiterProfile called")
    try {
        const { token, accountType } = req.headers

        if (!token) {
            res.status(401).json({ message: 'Token is missing' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("decoded.id : ", decoded.id)


        const recruiter = await recruiterModel.findOne({ user: decoded.id })
        if (!recruiter) {
            return res.status(404).json({ error: 'recruiter not found' });
        }
        try{
            const logoPath = `${recruiter.companyLogo}`;
            console.log("logo path : ", logoPath)
            const logo = await fs.promises.readFile(logoPath, { encoding: 'base64' });
            console.log("logoooo : ", logo)
            recruiter.companyLogo = `data:image/jpg;base64,${logo}`;
        }
        catch(err){
            recruiter.companyLogo = null
            console.log("file not found")
        }
        // await Promise.all(profiles.map(async (profile, index) => {
        //     try {
        //         const resumePath = `resumes/${profile.resume}`;
        //         const resume = await fs.promises.readFile(resumePath, { encoding: 'base64' });
        //         profile.resume = `data:application/pdf;base64,${resume}`;
        //         console.log("profile.resume : ", profile.resume)
        //     }
        //     catch (err) {
        //         profile.resume = null
        //         console.log("file not found")
        //     }
        // }

        // )
        // )
        return res.status(200).json(recruiter);


        console.log("we areee gooooodddd man")

    } catch (err) {
        res.status(401).json({ message: err });
    }


}




const setRecruiterProfile = async (req, res) => {

    console.log("set recruiter profile")
    console.log("req " , req.body)
    try {
        const { token, accountType } = req.headers

        if (!token) {
            res.status(401).json({ message: 'Token is missing' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        console.log("req.body.companyLogo" , req.body.companyLogo)
        
        // Check if the companyLogo property exists in the request body
        if (req.body.companyLogo) {
            // if (!req.body.companyLogo.match(/^data:image\/[a-z]+;base64,/)) {
            //     return res.status(400).json({ status: 'error', error: 'Invalid image format' });
            // }
            // decode the base64 encoded string
            const base64Data = req.body.companyLogo.split(';base64,').pop();
            console.log("base64Data ", base64Data)
            // specify a file name and path to save the file
            const fileName = `uploads/${Date.now()}_${req.body.companyName}.jpg`;

            await fs.promises.writeFile(fileName, base64Data.toString(), {encoding: 'base64'});
            req.body.companyLogo = fileName;
            await recruiterModel.updateOne({ user: decoded.id }, { $set: req.body });
            return res.status(200).json({ status: 'ok', message: 'we goooood !!!!' });
        }else{
            // If no logo is uploaded
            return res.status(400).json({status: 'error', error: 'No logo uploaded'});
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({ status: 'error', error: err });
    }
};

const recruiterPostJob = async (req, res) => {

    console.log("Post Job")
    console.log("post job req body :  " , req.body)
    try {
        const { token, accountType } = req.headers

        if (!token) {
            res.status(401).json({ message: 'Token is missing' });
        }
        const decoded = jwt.verify(token, JWT_SECRET);

        recruiterModel.findOne({ user: decoded.id }).populate('user').exec((err, recruiter) => {
            if (err) {
                res.status(401).json({ message: err });
            } else {
                // console.log("this is the recruiter here", recruiter);

                // res.status(200).json(recruiter)
                // console.log("recruiter",recruiter._id)
                const job = jobModel.create({recruiter: recruiter._id, job_title: req.body.job_title, job_type: req.body.job_type, job_location: req.body.job_location, salary_range: req.body.salary_range, job_description: req.body.job_description, skills: req.body.skills});
                // await recruiterModel.updateOne({ user: decoded.id }, { $set: req.body });
                return res.status(200).json({ status: 'ok', message: 'we goooood !!!!' });

            }
        });





    } catch (err) {
        console.error(err)
        res.status(500).json({ status: 'error', error: err });
    }
};

const recruiterEditJob = async(req,res) =>{

    try {
        const { token, accountType, id} = req.headers
        console.log("iddd : ", id)
        if (!token) {
            res.status(401).json({ message: 'Token is missing' });
        }
        const decoded = jwt.verify(token, JWT_SECRET);

        await jobModel.updateOne({ _id: id }, { $set: req.body });

        res.status(200).json({ status: 'ok', message: 'edited'});



    } catch (err) {
        console.error(err)
        res.status(500).json({ status: 'error', error: err });
    }
}



const recruiterDeleteJob = async(req,res) =>{
    
    try {
        const { token, accountType, id } = req.headers

        if (!token) {
            res.status(401).json({ message: 'Token is missing' });
        }
        const decoded = jwt.verify(token, JWT_SECRET);


        await jobModel.deleteOne({ _id: id });
        
        recruiterModel.findOne({ user: decoded.id }).populate('user').exec((err, recruiter) => {
            if (err) {
                res.status(401).json({ message: err });
            } else {

                jobModel.find({ recruiter: recruiter._id }).populate('recruiter').exec((err, jobs) => {
                    if (err) {
                        res.status(401).json({ message: err });
                    } else {
                        res.status(200).json({ status: 'ok', message: 'deleted', data: jobs});
                    }
                });
                // return res.status(200).json({ status: 'ok', message: 'we goooood !!!!' });
            }
        });

    } catch (err) {
        console.error(err)
        res.status(500).json({ status: 'error', error: err });
    }
};



const recruiterPostedJobs = async (req, res) => {

    console.log("posted jobs req headers :  " , req.headers)
    
    try {
        const { token, accountType } = req.headers

        if (!token) {
            res.status(401).json({ message: 'Token is missing' });
        }
        const decoded = jwt.verify(token, JWT_SECRET);

        recruiterModel.findOne({ user: decoded.id }).populate('user').exec((err, recruiter) => {
            if (err) {
                res.status(401).json({ message: err });
            } else {
                // console.log("this is the recruiter here", recruiter);

                // res.status(200).json(recruiter)
                // console.log("recruiter",recruiter._id)
                jobModel.find({ recruiter: recruiter._id }).populate('recruiter').exec((err, jobs) => {
                    if (err) {
                        res.status(401).json({ message: err });
                    } else {
                        return res.status(200).json({ status: 'ok', data: jobs});
                    }
                });
            }
        });


    } catch (err) {
        console.error(err)
        res.status(500).json({ status: 'error', error: err });
    }
};





const getPotentialCandidates = async(req,res)=>{

    try {
        const { token, accountType } = req.headers

        const job = req.body
        if(!req.body){
            res.status(401).json({ message: 'job detail is missing'});
        }
        if (!token) {
            res.status(401).json({ message: 'Token is missing'});
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        
        profiles = await studentModel.find({profileStatus: true, skills: { $exists: true, $type: 'array', $ne: [] }})

        profiles.sort((profileA, profileB) => {
            const aMatchingSkills = profileA.skills.filter(skill => job.skills.includes(skill)).length;
            const bMatchingSkills = profileB.skills.filter(skill => job.skills.includes(skill)).length;
            
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
        await Promise.all(profiles.map(async (profile, index) => {
            try {
                const resumePath = `resumes/${profile.resume}`;
                const resume = await fs.promises.readFile(resumePath, { encoding: 'base64' });
                profile.resume = `data:application/pdf;base64,${resume}`;
                console.log("profile.resume : ", profile.resume)
            }
            catch (err) {
                profile.resume = null
                console.log("file not found")
            }
        }

        )
        )
        

        console.log(profiles)

        
        return res.status(200).json({ status: 'ok', profiles})



    } catch (err) {
        console.error(err)
        res.status(500).json({ status: 'error', error: err });
    }



}





module.exports = {getRecruiterProfile, setRecruiterProfile, recruiterPostJob, recruiterPostedJobs, recruiterDeleteJob, recruiterEditJob, getPotentialCandidates}