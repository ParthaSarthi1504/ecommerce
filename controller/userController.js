const { comparePassword, hashPassword } = require("../config/bcrypt");
const {
  generateJsonWebToken,
  verifyJsonWebToken,
} = require("../config/jwtToken");
const asyncErrorHandler = require("../middlewares/authErrorHandler");
const userModel = require("../models/userModel");


//REGISTER USER
const registerUser = async (req, res) => {
  try {
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
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//LOGIN USER
const loginUser = async (req, res) => {
  try {
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

    const jwtToken = await generateJsonWebToken(payload);

    return res.status(200).json({ jwtToken });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//GET ALL USERS
const getAllUsers = asyncErrorHandler(async (req, res, next) => {
  const allUsers = await userModel.getAllUsers();
  res.status(200).json(allUsers);
});

//GET USER BY ID
const getUserById = asyncErrorHandler(async (req, res,next) => {
  const id = req.params;
  const user = await userModel.getUserById(id);
  if (!user) {
    throw Error("User Not Found");
  }
  res.status(200).json(user);
});

//UPDATE USER
const updateUserById = asyncErrorHandler(async (req, res,next) => {
  const id = req.params;
  await userModel.updateUserById(id, req.body);
  res.status(200).json({ message: "User Updated Successfully" });
});

//DELETE USER
const deleteUserById = asyncErrorHandler(async (req, res,next) => {
  const { id } = req.params;
  await userModel.deleteUser(id);
  res.status(200).json({ message: "User Deleted Sucessfully" });
});

//BLOCK USER
const blockUserById = asyncErrorHandler(async (req, res,next) => {
  const { id } = req.params;
  await userModel.blockUser(id);
  res.status(200).json({ message: "User Blocked Sucessfully" });
});

//UNBLOCK USER
const unBlockUserById = asyncErrorHandler(async (req, res,next) => {
  const { id } = req.params;
  await userModel.unBlockUser(id);
  res.status(200).json({ message: "User Unblocked Sucessfully" });
});

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUserById,
  blockUserById,
  unBlockUserById
};
