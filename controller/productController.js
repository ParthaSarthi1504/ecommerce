const asyncErrorHandler = require("../middlewares/authErrorHandler");
const productModel = require("../models/productModel");
const { validateProductId } = require("../utills/valitation");
const slugify = require('slugify');

//GET ALL PRODUCTS
const getAllProduct = asyncErrorHandler(async (req, res, next) => {
    const allProducts = await productModel.getAllProducts();
    res.status(200).json(allProducts);
});

//CREATE PRODUCT
const createProduct = asyncErrorHandler(async (req, res, next) => {
    if (req?.body?.title){
        req.body.slug = slugify(req?.body?.title, { lower: true});
    }
    if (req?.body?.images){
        req.body.images = JSON.stringify(req?.body?.images);
    }
    await productModel.createProduct(req?.body);
    res.status(200).json({message: "Product Craeted Successfully"});
});

//GET PRODUCT BY ID
const getProductById = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const product = await productModel.getProductById(id);
    if (!product) {
        throw Error("Product Not Found");
    }
    res.status(200).json(product);
});

//UPDATE PRODUCT
const updateProductById = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    await validateProductId(id);
    if (req?.body?.title){
        req.body.slug = slugify(req?.body?.title, { lower: true});
    }
    if (req?.body?.images){
        req.body.images= JSON.stringify(req?.body?.images);
    }
    await productModel.updateProductById(id, req.body);
    res.status(200).json({ message: "Product Updated Successfully" });
});

//DELETE PRODUCT
const deleteProductById = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    await validateProductId(id);
    await productModel.deleteProduct(id);
    res.status(200).json({ message: "Product Deleted Sucessfully" });
});

module.exports={
    getAllProduct,
    getProductById,
    createProduct,
    updateProductById,
    deleteProductById
};