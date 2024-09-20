const express = require('express');
const { registerUser, loginUser, getAllUsers, getUserById, deleteUserById, updateUserById, blockUserById, unBlockUserById, handleRefreshToken, logoutUser } = require('../controller/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');
const validateUserId = require('../utills/valitateUserId');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/refresh',handleRefreshToken);
router.get('/logout', logoutUser);

router.get('/all-users',authMiddleware,isAdmin, getAllUsers);
router.get('/:id',authMiddleware, getUserById);
router.delete('/delete/:id',authMiddleware,isAdmin, deleteUserById);
router.put("/edit/:id",authMiddleware, updateUserById);
router.put("/block/:id",authMiddleware,isAdmin, blockUserById);
router.put("/unblock/:id",authMiddleware,isAdmin, unBlockUserById);


module.exports = router;