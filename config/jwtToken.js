require('dotenv').config();
const jwt = require('jsonwebtoken');

const generateJsonWebToken = async(payload) =>{
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET_KEY, {expiresIn: '15m'});
}

const generateRefreshToken = async(payload) =>{
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET_KEY, {expiresIn: '7d'});
}

const verifyJsonWebToken = (token,tokenType) =>{
    const secretKey = tokenType === "jsonWebToken" ? process.env.ACCESS_TOKEN_SECRET_KEY : process.env.REFRESH_TOKEN_SECRET_KEY;
    return new Promise((resolve, reject)=>{
        jwt.verify(token, secretKey, (err, payload)=>{
            if (err) reject(err);
            resolve(payload);
        })
    })
}

module.exports = {generateJsonWebToken,generateRefreshToken, verifyJsonWebToken};