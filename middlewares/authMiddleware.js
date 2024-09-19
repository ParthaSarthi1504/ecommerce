const { verifyJsonWebToken } = require("../config/jwtToken");
const { getUserByEmail } = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
    try {
        let jwtToken;
        const authHeader = req.headers["authorization"];

        if (authHeader) {
            jwtToken = authHeader.split(" ")[1];
        }

        if (jwtToken) {
            const isValidToken = await verifyJsonWebToken(jwtToken);
            if (!isValidToken) {
                throw new Error("Invalid JWT Token")
            }
            const user = await getUserByEmail(isValidToken?.email)
            if(!user){
                throw Error("User Not Found");
            }
            req.user = user;
            next()
        } else {
            throw Error("Access Token Not Found");
        }
    } catch (err) {
        next(err);
    }
}

module.exports = authMiddleware;