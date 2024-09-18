const error = (err,req,res,next)=>{
    err.statusCode = error.statusCode || 500;
    return res.status(err.statusCode).json({message: err.message});
}

module.exports = error;