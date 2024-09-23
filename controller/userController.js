const { comparePassword, hashPassword } = require("../config/bcrypt");
const {
  generateJsonWebToken,
  generateRefreshToken,
  verifyJsonWebToken,
} = require("../config/jwtToken");
const asyncErrorHandler = require("../middlewares/authErrorHandler");
const userModel = require("../models/userModel");
const cookies = require('cookie-parser');
const {validateUserId} = require("../utills/valitation");


//REGISTER USER
const registerUser = asyncErrorHandler(async (req, res) => {
    const { email, password } = req.body;
    const userExist = await userModel.getUserByEmail(email);
    if (!userExist) {
      const hashedPassword = await hashPassword(password);
      req.body.password = hashedPassword;
      await userModel.createUser(req.body);
      return res.status(200).json({ message: "User Created Successfully" });
    } else {
      return res.status(400).json({ message: "User already Exist" });
    }
});

//LOGIN USER
const loginUser = asyncErrorHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).json({ message: "Enter Email and Password" });
    }

    const user = await userModel.getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const isPasswordMatch = await comparePassword(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    const payload = { email };

    const accessToken = await generateJsonWebToken(payload); // Access Token
    const refreshToken = await generateRefreshToken(payload); // Refresh Token

    const userId = user?.id;
    delete user["id"];
    const updateBody = {...user,refresh_token: refreshToken};

    await userModel.updateUserById(userId,updateBody) // adding refresh token into user table

    // Storing refresh token in cookies
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7*24*60*60*1000
    })

    return res.status(200).json({ accessToken});
});

//LOGOUT 
const logoutUser = asyncErrorHandler(async(req,res,next)=>{
  const refreshToken = req?.cookies?.refreshToken;
  if(!refreshToken){
    throw Error("Refresh Token Not Found");
  }
  const user = await userModel.getUser("refresh_token",refreshToken);
  if (!user){
    res.clearCookie("refreshToken",{
      httpOnly: true,
      secure: true
    })
    res.sendStatus(204);
  }
  await userModel.updateUserById(user?.id,{refresh_token: ''})
  res.clearCookie("refreshToken",{
    httpOnly: true,
    secure: true
  })
  res.sendStatus(204);
});

//GET ALL USERS
const getAllUsers = asyncErrorHandler(async (req, res, next) => {
  const allUsers = await userModel.getAllUsers();
  res.status(200).json(allUsers);
});

//GET USER BY ID
const getUserById = asyncErrorHandler(async (req, res,next) => {
  const {id} = req.params;
  const user = await userModel.getUserById(id);
  if (!user) {
    throw Error("User Not Found");
  }
  res.status(200).json(user);
});

//UPDATE USER
const updateUserById = asyncErrorHandler(async (req, res,next) => {
  const {id} = req.params;
  await validateUserId(id);

  const {body} = req;
  if (body?.email || body?.password){
    throw Error("Email or Password can not be Updated");
  }
  await userModel.updateUserById(id, req.body);
  res.status(200).json({ message: "User Updated Successfully" });
});

//DELETE USER
const deleteUserById = asyncErrorHandler(async (req, res,next) => {
  const { id } = req.params;
  await validateUserId(id);
  await userModel.deleteUser(id);
  res.status(200).json({ message: "User Deleted Sucessfully" });
});

//BLOCK USER
const blockUserById = asyncErrorHandler(async (req, res,next) => {
  const { id } = req.params;
  await validateUserId(id);
  await userModel.blockUser(id);
  res.status(200).json({ message: "User Blocked Sucessfully" });
});

//UNBLOCK USER
const unBlockUserById = asyncErrorHandler(async (req, res,next) => {
  const { id } = req.params;
  await validateUserId(id);
  await userModel.unBlockUser(id);
  res.status(200).json({ message: "User Unblocked Sucessfully" });
});

//HANDLE REFRESH TOKEN
const handleRefreshToken = asyncErrorHandler(async(req,res,next)=>{
  let refreshToken;
  const cookie = req.cookies;
  if (cookie){
    refreshToken = cookie["refreshToken"];
  }
  if (!refreshToken) throw Error("Refresh Token Not Found");
  const decoded = await verifyJsonWebToken(refreshToken, "REFRESH_TOKEN");
  if (!decoded) throw Error("Invalid Refresh Token");
  const {email} = decoded;
  // const user = await userModel.getUserByEmail(email);
  const accessToken = await generateJsonWebToken({email})
  res.status(200).json({accessToken});
})

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUserById,
  blockUserById,
  unBlockUserById,
  handleRefreshToken
};
