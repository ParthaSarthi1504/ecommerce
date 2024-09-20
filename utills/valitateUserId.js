const { getUserById } = require("../models/userModel");

const validateUserId = async (id) => {
    const user = await getUserById(id);
    if (!user){
      throw Error("Invalid User ID");
    }
};

module.exports = validateUserId;