const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const passport = require('passport');

//Register user
exports.register = async (req, res) => {
  const title = 'signup page';
  const user = req.user;
  const errors = await validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('signup', { errors: errors.array(), title, user });
  }

  const { name, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.render('signup', { errors: [{ msg: 'Email already exists' }], title, user });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    req.flash('success_msg', 'Registration successful! You can now log in.');
    res.redirect('/auth/login');
  } catch (error) {
    res.render('signup', { errors: [{ msg: 'Error registering user' }], title, user });
  }
};

//Login user
exports.login = async (req, res, next) => {
  const{email, password} = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('login', { errors: errors.array(), title:'login', user: req.user, msg:'' });
  }

  let user = await User.findOne({ email });
  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('login', { 
        msg: 'Invalid email or password',
        title:'login page',
        user: req.user, 
        errors:[] 
      });
    }
  }
  //Redirect based on role
  try{

    if (user.role === 'admin') {
    passport.authenticate('local', {
      successRedirect: '/admin/dashboard',
      failureRedirect: '/auth/login',
      failureFlash: true,
    })(req, res, next);
    req.flash('success_msg', 'Login successful');
  }else {
    passport.authenticate('local', {
      successRedirect: '/assets',
      failureRedirect: '/auth/login',
      failureFlash: true,
    })(req, res, next);
  }
  }catch(error){
    console.log(error)
  }
};

// Logout User
exports.logout = (req, res) => {
  req.logout(() => {
   req.flash('success_msg', 'You are logged out');
   res.render('login', {title:'login page', user: req.user, msg:req.flash('success_msg'), errors:[]});
  });
};

