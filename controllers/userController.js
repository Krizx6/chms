const { validationResult } = require('express-validator');
const User = require('../models/User');

exports.changePassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('change-password', { errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!(await bcrypt.compare(currentPassword, user.password))) {
      return res.render('change-password', { errors: [{ msg: 'Incorrect current password' }] });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    req.flash('success_msg', 'Password changed successfully!');
    res.redirect('/dashboard');
  }

  
  exports.getUsers = async(req, res)=>{
    let Users = await User.find();
    res.render('users',{title:'users', user: req.user, Users });
  }