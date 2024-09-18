require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'ecommerce',
    password: process.env.DATABASE_PASSWORD
})

const toCheckConnection = async()=>{
    try{
        const connection =await pool.getConnection();
        console.log("Datebase Connected Successfully");
        connection.release();
    }catch(error){
        console.log("Error in Database Connection: "+ error.message);
    }
}

toCheckConnection();

module.exports = pool;