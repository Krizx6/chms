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
  res.render('users',{title:'chms users', user: req.user, Users });
}

// exports.updateUserRole = async(req, res)=>{
//   await User.findByIdAndUpdate(req.params.id,{role:req.body.role});
  
//   //res.render('users',{title:'chms users', user: req.user, Users });
// }
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Optional: Validate role
    const validRoles = ['user', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).send('Invalid role selected');
    }

    const user = await User.findByIdAndUpdate(id, { role }, { new: true });

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Redirect or respond based on your frontend
    res.redirect('/users/allusers'); // Or send a success message
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};



