require('dotenv').config();
const jwt = require('jsonwebtoken');

const generateJsonWebToken = async(payload) =>{
    return jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: '1d'});
}

const verifyJsonWebToken = (token) =>{
    return new Promise((resolve, reject)=>{
        jwt.verify(token, process.env.SECRET_KEY, (err, payload)=>{
            if (err) reject(err);
            resolve(payload);
        })
    })
}

module.exports = {generateJsonWebToken, verifyJsonWebToken};