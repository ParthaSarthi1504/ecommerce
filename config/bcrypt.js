const bcrypt = require('bcrypt');

const hashPassword = async(password)=>{
    return bcrypt.hash(password, 10);
}

const comparePassword = async(password, hashPassword) =>{
    return bcrypt.compare(password, hashPassword)
}


module.exports = {hashPassword, comparePassword};