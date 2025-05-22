const express = require('express');
const authController = require('../controllers/authController')
const Valid = require('../config/validation');
const { title } = require('process');

const router = express.Router();

// User Registration
router.get('/register',(req, res)=>{
    res.render('signup',{title:'signup page', user:req.user, errors: []});
});

router.post('/register',Valid.signUpValidation,authController.register);

// User Login
router.get('/login',(req, res)=>{
  res.render('login', {title:'login page', user: req.user, msg:'', errors: []});
});

router.post('/login',Valid.loginValidation,authController.login);

// Logout
router.get('/logout', authController.logout);


module.exports = router;
