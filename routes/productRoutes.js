const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');
const { getAllProduct, getProductById, deleteProductById, updateProductById, createProduct } = require('../controller/productController');

const router = express.Router();

router.post("/",authMiddleware,isAdmin, createProduct);
router.get('/all-product',authMiddleware,isAdmin, getAllProduct);
router.get('/:id',authMiddleware, getProductById);
router.put("/edit/:id",authMiddleware, updateProductById);
router.delete('/delete/:id',authMiddleware,isAdmin, deleteProductById);

module.exports = router;