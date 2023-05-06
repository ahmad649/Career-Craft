// routes/api.js
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const UserModel = require('../models/userModel');
const {
    createNewUser,
    getSingleUser,
    getAllUsers,
    deleteUser,
    updateUser,
    loginUser,
    verifyUser,
    getTandC,
    setTandC,
    searchJobs,
    getjobdetail,
    changePassword,
} = require('../controllers/userController'); // we require all these function from the user controller

const {
    getStudentProfile,
    setStudentProfile,
    getPotentialPaths,
    getRelevantSkills,
    getRankedJobs,
    getCareerPathInfo,
} = require('../controllers/studentController'); // we require all these function from the user controller

const {
    getRecruiterProfile,
    setRecruiterProfile,
    recruiterDeleteJob,
    recruiterPostJob,
    recruiterPostedJobs,
    recruiterEditJob,
    getPotentialCandidates,
} = require('../controllers/recruiterController'); // we require all these function from the user controller




const { verify } = require('jsonwebtoken');
// const { default: SearchJobs } = require('../../frontend/src/pages/SearchJobs');

//return landing page
router.get('/', (req, res) => {
    res.json({msg:  'this is landing page'})
});

router.get('/users', getAllUsers);

router.get('/:id', getSingleUser);

router.post('/register', createNewUser);

router.post('/searchjobs', searchJobs)

router.post('/getjobdetail', getjobdetail)

router.post('/login', loginUser);

router.delete('/:id', deleteUser);

router.patch('/:id', updateUser);

router.post('/changepassword', changePassword);

router.post('/verifyuser', verifyUser);

router.post('/gettandc', getTandC);

router.post('/settandc', setTandC);

router.get('/student/getprofile', getStudentProfile);

router.post('/student/setprofile', setStudentProfile);

router.get('/student/getpotentialpaths', getPotentialPaths)

router.get('/student/getrelevantskills',getRelevantSkills);

router.post('/student/getrankedjobs', getRankedJobs);

router.post('/student/getpathinfo',getCareerPathInfo);

router.get('/recruiter/getprofile', getRecruiterProfile);

router.post('/recruiter/postjob', recruiterPostJob);

router.get('/recruiter/getpostedjobs', recruiterPostedJobs);

router.post('/recruiter/getsuitablecandidates', getPotentialCandidates);

router.post('/recruiter/setprofile', setRecruiterProfile);

router.delete('/recruiter/deletejob', recruiterDeleteJob);

router.post('/recruiter/editjob', recruiterEditJob);

module.exports = router;
