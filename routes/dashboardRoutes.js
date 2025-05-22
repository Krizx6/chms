const express = require('express');
const Asset = require('../models/Asset');
const User = require('../models/User');

const authMiddleware = require('../config/auth');


const router = express.Router();

// Dashboard
router.get('/',authMiddleware, async (req, res) => {
  res.set('Cache-Control', 'no-store')
  const title = 'dashboard';
  const user = req.user;
  req.flash('success_msg', 'You are logged in');

  const assetCount = await Asset.countDocuments();
  const userCount = await User.countDocuments();
  const recentAssets = await Asset.find().sort({ createdAt: -1 }).limit(5);

  res.render('dashboard', { 
    assets: assetCount, 
    users: userCount, 
    recentAssets, 
    title,
    user,
    msg: req.flash('success_msg')
  });
});


module.exports = router;
