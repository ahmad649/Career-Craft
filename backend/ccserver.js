// the career craft server
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require("cors");
const approutes =  require('./routes/approutes');

const app = express();

// Connect to MongoDB
mongoose.set('strictQuery', false);
// mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
    .then(()=>{ // if connection to db succeeds, then listen at port 3000
            // Start the server
        app.listen(process.env.PORT, () => {
            console.log('connected to db and Server started on port : ',process.env.PORT );
        });
    })
    .catch((error)=>{
        console.log(error);
    })



// middleware
// app.use(express.urlencoded({ extended: true }));
// app.use(express.bodyParser({limit: '5mb'}))
app.use(express.json({limit: '5mb'}));
app.use(cors())
app.use((req,res,next)=>{
    console.log(req.path,req.method);
    next();
});


// Define routes
app.use('/api/routes',approutes);

// Start the server
// app.listen(process.env.PORT, () => {
//     console.log('Server started on port : ',process.env.PORT );
// });