const express = require('express');
const { registerUser, loginUser, getAllUsers, getUserById, deleteUserById, updateUserById, blockUserById, unBlockUserById } = require('../controller/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/all-users',authMiddleware,isAdmin, getAllUsers);
router.get('/:id',authMiddleware, getUserById);
router.delete('/:id',authMiddleware,isAdmin, deleteUserById);
router.put("/:id",authMiddleware, updateUserById);
router.put("/block/:id",authMiddleware,isAdmin, blockUserById);
router.put("/unblock/:id",authMiddleware,isAdmin, unBlockUserById);

module.exports = router;