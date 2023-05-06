require('dotenv').config();
const userModel = require('../models/userModel');
const studentModel = require('../models/studentModel');
const recruiterModel = require('../models/recruiterModel')
const {execFile} = require('child_process')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET_KEY

// get all users
const getAllUsers = async (req,res) => {
    
    const users = await userModel.find({}).sort({createdAt: -1});
    res.status(200).json(users);
}

// get a single user
const getSingleUser = async (req,res) => {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'id format not valid'});
    }

    const user = await userModel.findById(id);
    if(!user){
        return res.status(404).json({error: 'no such user'});
    }
    res.status(200).json(user);

}


// create a new user
const createNewUser = async (req,res) => {
    
    const {email, password: plainTextPassword ,accountType} = req.body;
    const password = await bcrypt.hash(plainTextPassword, 10)
    const termsAndConditions = false

    if (!email || typeof email !== 'string') {
		return res.json({ status: 'error', error: 'Invalid email' })
	}

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}


    try {
        const user = await userModel.create({email,password,accountType,termsAndConditions});
        console.log('User created successfully: ', user)

        if(user.accountType === true){
            const student = await studentModel.create({user: user._id, fname: '', lname:'', cnic:'', city:'', prefferedEmail:'', phone:'', skills:[], profileStatus:'1'})
            console.log('student created')
        }else{
            const rectruiter = await recruiterModel.create({user: user._id, fname: '', lname:'', cnic:'', prefferedEmail:'', currentPosition:'',companyLogo:null, companyName:'', companyLocation:'', dateEstablished:'', domainOfWork:'', numberOfWorkers:0})
            console.log("rectruiter created")

        }
        return res.status(200).json(user);
		
    } catch (error) {

		if (error.code  == 11000) {
			// duplicate key
			return res.status(409).json({ status: 'error', error: 'Username already in use !!!!' })
		}
        return res.status(400).json({ status: 'error', error: 'something went wrong, are inputs valid?' })
		// throw error
	}

}


const loginUser = async(req,res) => {
    const { email, password } = req.body
	const user = await userModel.findOne({ email }).lean() // find an email in the model

	if (!user) {
		return res.json({ status: 'error', error: 'Invalid username/password' })
	}

	if (await bcrypt.compare(password, user.password)) { // if email found then we go here and compare password
		// the username, password combination is successful

		const token = jwt.sign(
			{
				id: user._id,
				email: user.email,
                accountType: user.accountType
			},
			JWT_SECRET
		)
        let accountType = user.accountType

		return res.json({ status: 'ok', data: token, accountType: accountType})
	}

	res.json({ status: 'error', error: 'Invalid username/password' })
}

// delete a user
const deleteUser = async (req,res) => {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'id format not valid'});
    }

    const user = await userModel.findOneAndDelete({_id: id});
    if(!user){
        return res.status(400).json({error: 'no such user'});
    }
    res.status(200).json(user);

}

// update user
const updateUser = async (req,res) => {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'id format not valid'});
    }

    const user = await userModel.findOneAndUpdate({_id: id},{...req.body}); //...req.body will spread whatever property we have in the request to whatever we have in the update
    if(!user){
        return res.status(400).json({error: 'no such user'});
    }
    res.status(200).json(user);  

}

const verifyUser = async(req,res) => {

    const {token, accountType } = req.body


    if (!token) {
        res.status(401).json({ message: 'Token is missing' });
        return;
    }
    // const accountType = req.body['account-type'];
    if (!accountType) {
        res.status(401).json({ message: 'Account-Type is missing' });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        let decodedAccountType = decoded.accountType.toString()

        if (decodedAccountType === accountType){
            res.status(200).json({accountType:decodedAccountType, message: 'verified' });

        }else{
            res.status(401).json({ message: 'Invalid token' });

        }

    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
          // Handle invalid token
            res.status(401).json({ message: 'Invalid token' });
            
        } else {
          // Handle other errors
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

const getTandC = async(req,res) =>{
    console.log("made it to tandc : " , req.headers)
    const {token, accounttype } = req.headers


    if (!token) {
        res.status(401).json({ message: 'Token is missing' });
        return;
    }
    
    console.log("tanc1111111 , ", accounttype)
    // const accountType = req.body['account-type'];
    if (!accounttype) {
        res.status(401).json({ message: 'Account-Type is missing' });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await userModel.findOne({ _id: decoded.id })
        console.log("tanc 33333 : ",!user.termsAndConditions)

        res.status(200).json({ status: 'ok', data: !user.termsAndConditions });

    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
          // Handle invalid token
            res.status(401).json({ message: 'Invalid token' });
            
        } else {
            res.status(500).json({ message: 'Internal servsssser error' });
        }
    }

}

const setTandC = async(req,res) =>{
    console.log("made it to settandc : " , req.headers)
    const {token, accounttype } = req.headers

    if (!token) {
        res.status(401).json({ message: 'Token is missing' });
        return;
    }
    
    console.log("tanc1111111 , ", accounttype)
    // const accountType = req.body['account-type'];
    if (!accounttype) {
        res.status(401).json({ message: 'Account-Type is missing' });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await userModel.findOneAndUpdate({_id: decoded.id},{termsAndConditions:true})
        
        res.status(200).json({ status: 'ok'});

    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
          // Handle invalid token
            res.status(401).json({ message: 'Invalid token' });
            
        } else {
            res.status(500).json({ message: 'Internal servsssser error' });
        }
    }



}



const searchJobs = async(req,res) => {
    const { keyword, location } = req.body;

    if (!keyword) {
        return res.json({ status: 'error', error: 'keyword missing' });
    }

    try {
        console.log("keyword :", keyword);
        console.log("location :", location);
        
        const params = new URLSearchParams();
        params.append('keyword', keyword);
        params.append('location', location);

        const response = await fetch(`http://127.0.0.1:5000/jobsearch?${params.toString()}`)
        const data = await response.json();
        console.log("data",data);
        res.status(200).json({ status: 'ok', message:'all gud', data: data });
        // res.status(200).json({ status: 'ok', data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getjobdetail = async(req,res) => {
    
    const { url, scraper_name } = req.headers;

    console.log("url :", url);
    console.log("scraper_name :", scraper_name);

    if (!url) {
        return res.json({ status: 'error', error: 'url missing' });
    }
    // res.status(200).json({ status: 'ok', message:'all gud', data: url });

    try {
        const params = new URLSearchParams();
        params.append('url', url);
        params.append('scraper_name', scraper_name);

        const response = await fetch(`http://127.0.0.1:5000/jobdetail?${params.toString()}`)
        const data = await response.json();
        console.log("data",data);
        res.status(200).json({ status: 'ok', message:'all gud', data: data });
        // res.status(200).json({ status: 'ok', data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const changePassword = async(req,res) => {
    
    const { token, oldPassword, newPassword, confirmNewPassword } = req.body;
    const decoded = jwt.verify(token, JWT_SECRET);
    const email = decoded.email
    const user = await userModel.findOne({ email }).lean()

    if (await bcrypt.compare(oldPassword, user.password)) {
        if (newPassword.length < 6 ){
            return res.json({ status: 'passwordError', message: 'Password must be greater than 5 characters'})
        }
        if (newPassword == confirmNewPassword){
            console.log("password equal : ", newPassword)
            const password = await bcrypt.hash(newPassword, 10)
            
            userModel.findByIdAndUpdate(user._id, {password}, (err, updatedUser) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(updatedUser);
                    return res.json({status: 'ok', message: 'password changed'})
                }
            });
        }else{
            return res.json({ status: 'passwordError', message: 'New Password and Confirm new password do not match'})
        }
	}else{
        return res.json({ status: 'passwordError', message: 'Old password is not correct'})
    }

}



module.exports  = {createNewUser, loginUser, getAllUsers, getSingleUser, deleteUser, updateUser, verifyUser, getTandC, setTandC, searchJobs, getjobdetail, changePassword}