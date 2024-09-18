require('dotenv').config();
const express = require('express');
const db = require("./config/dbConfig");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = require('./routes/authRoutes');
const error = require('./middlewares/error');

const app = express();
const PORT = process.env.PORT || 4000;

//body parser
app.use(express.json());

app.use('/api/user', router);


// Global Error Handler
app.use(error);

app.listen(PORT, ()=>{
    console.log("Server Connected on Port : "+ PORT);
})