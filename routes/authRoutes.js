const express = require('express');
const { registerUser, loginUser, getAllUsers, getUserById, deleteUserById, updateUserById } = require('../controller/userController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/all-users', getAllUsers);
router.get('/:id', getUserById);
router.delete('/:id', deleteUserById);
router.put("/:id", updateUserById);

module.exports = router;