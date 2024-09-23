const { getProductById } = require("../models/productModel");
const { getUserById } = require("../models/userModel");

const validateUserId = async (id) => {
    const user = await getUserById(id);
    if (!user){
      throw Error("Invalid User ID");
    }
};

const validateProductId = async (id) => {
  const product = await getProductById(id);
  if (!product){
    throw Error("Invalid Product ID");
  }
};

module.exports = {validateUserId, validateProductId};