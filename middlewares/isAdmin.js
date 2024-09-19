const { getUserByEmail } = require("../models/userModel");

const isAdmin = async(req, res, next)=>{
    try{
        const {email} = req?.user;
        const userDetails = await getUserByEmail(email);
        if (userDetails.role !== "admin"){
            throw Error("Permission Denied! You are not Admin");
        }
        next();
    }catch(err){
        next(err);
    }
}

module.exports = isAdmin;