require('dotenv').config();
const express = require('express');
const db = require("./config/dbConfig");
const authRouter = require('./routes/authRoutes');
const productRouter = require('./routes/productRoutes');
const error = require('./middlewares/error');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 4000;

//body parser
app.use(express.json());

//cookie parser
app.use(cookieParser());

app.use('/api/user', authRouter);
app.use('/api/product',productRouter);

// Global Error Handler
app.use(error);

app.listen(PORT, ()=>{
    console.log("Server Connected on Port : "+ PORT);
})