const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const validation = require('../config/validation');
const userController = require('../controllers/userController');
const authMiddleware = require('../config/auth');

const router = express.Router();

// Change Password
router.post('/change-password',validation.changePass,userController.changePassword);



// load users page from admin dashboard
router.get('/allusers',authMiddleware, userController.getUsers);

router.post('/update-user-role/:id', userController.updateUserRole);


module.exports = router;

