const express = require('express');
const router = express.Router();
const Asset = require('../models/Asset');
const User = require('../models/User');
const auth = require('../config/auth');
const campaignController = require('../controllers/camiContooler')


router.get('/dashboard', auth, async (req, res) => {
  res.set('Cache-Control', 'no-store')
  const title = 'dashboard';
  const user = req.user;
  req.flash('success_msg', 'You are logged in');
  
  const assetCount = await Asset.countDocuments();
  const userCount = await User.countDocuments();
  const recentAssets = await Asset.find().sort({ createdAt: -1 }).limit(2);
  //const campaigns = await campaignController.findAll();

  res.render('admin-dashboard', { 
    assets: assetCount, 
    users: userCount, 
    recentAssets, 
    title,
    user,
    msg: req.flash('success_msg'),
    campaigns:""
  })
});

//campaign
router.post("/campaign", campaignController.addacampaign);


module.exports = router;
