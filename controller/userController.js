const { comparePassword, hashPassword } = require("../config/bcrypt");
const {
  generateJsonWebToken,
  verifyJsonWebToken,
} = require("../config/jwtToken");
const asyncErrorHandler = require("../middlewares/authErrorHandler");
const userModel = require("../models/userModel");

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
    let jwtToken;
    const authHeader = req.headers["authentication"];

    if (authHeader) {
      jwtToken = authHeader.split(" ")[1];
    }

    if (jwtToken) {
      const isValidToken = await verifyJsonWebToken(jwtToken);
      if (!isValidToken) {
        throw new Error("Invalid JWT Token")
        // return res.status(400).json({ message: "Invalid JWT Token" });
      }
      const allUsers = await userModel.getAllUsers();
      res.status(200).json(allUsers);
    } else {
      throw new Error("Token Not Found")
      // return res.status(404).json({ message: "Token Not Found" });
    }
});

//GET USER BY ID
const getUserById = async (req, res) => {
  try {
    let jwtToken;
    const { id } = req.params;
    const authHeader = req.headers["authentication"];

    if (authHeader) {
      jwtToken = authHeader.split(" ")[1];
    }

    if (jwtToken) {
      const isValidToken = await verifyJsonWebToken(jwtToken);
      if (!isValidToken) {
        return res.status(400).json({ message: "Invalid JWT Token" });
      }
      const user = await userModel.getUserById(id);
      if (user) {
        res.status(200).json(user);
      } else {
        return res.status(404).json({ message: "User Not Found" });
      }
    } else {
      return res.status(404).json({ message: "Token Not Found" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//UPDATE USER
const updateUserById = async (req, res) => {
  try {
    let jwtToken;
    const { id } = req.params;
    const authHeader = req.headers["authentication"];

    if (authHeader) {
      jwtToken = authHeader.split(" ")[1];
    }
    console.log("tryujuuj")
    if (jwtToken) {
      const isValidToken = await verifyJsonWebToken(jwtToken);
      if (!isValidToken) {
        return res.status(400).json({ message: "Invalid JWT Token" });
      }
      
      await userModel.updateUserById(id, req.body);
      res.status(200).json({ message: "User Updated Successfully" });
    } else {
      return res.status(404).json({ message: "Token Not Found" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//DELETE USER
const deleteUserById = async (req, res) => {
  try {
    let jwtToken;
    const { id } = req.params;
    const authHeader = req.headers["authentication"];

    if (authHeader) {
      jwtToken = authHeader.split(" ")[1];
    }

    if (jwtToken) {
      const isValidToken = await verifyJsonWebToken(jwtToken);
      if (!isValidToken) {
        return res.status(400).json({ message: "Invalid JWT Token" });
      }
      await userModel.deleteUser(id);
      res.status(200).json({ message: "User Deleted Sucessfully" });
    } else {
      return res.status(404).json({ message: "Token Not Found" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUserById
};
