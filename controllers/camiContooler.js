const camp = require('../models/Campaigns');


exports.addacampaign = async (req, res) => {
  const{campaignTitle, campaignMessege} = req.body;

  await camp.create({
   campaignTitle, 
   campaignMessege
  });
  res.redirect("/admin/dashboard");
}