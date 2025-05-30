const path = require('path');
const fs = require('fs');
const Asset = require('../models/Asset');
const comment = require('../models/comments');


exports.addacomment = async (req, res) => {
  const{commentMsg} = req.body;

  await comment.create({
    commentMsg
  })
  return;
}

exports.getAssets = async (req, res) => {
  const assets = await Asset.find().sort({ createdAt: -1 });
  const user = req.user
  res.render('assets', { assets,title:'assets', user, msg: req.flash('success_msg')});
};

exports.addAsset = async (req, res) => {
  if (req.fileValidationError) {
    return res.render('add-asset',{title: "kk", user: req.user, msg: req.fileValidationError})
  } 
  // Helper: Save base64 image as file
  function saveBase64Image(dataUrl) {
    const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
    const ext = matches[1].split('/')[1];
    const buffer = Buffer.from(matches[2], 'base64');

    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir); // Create the directory if it doesn't exist
    }

    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filepath = path.join('uploads', filename);
    fs.writeFileSync(filepath, buffer);
    return `/uploads/${filename}`;
  }

   //get incoming form data
   const { name, category, description, location, long, lat } = req.body;

  // Parse and replace base64 images
  const imgRegex = /<img[^>]+src="data:(image\/[^;]+);base64,([^"]+)"[^>]*>/g;
  let images = [];
  let updatedContent = description.replace(imgRegex, (match, mimeType, base64) => {
    const dataUrl = `data:${mimeType};base64,${base64}`;
    const filePath = saveBase64Image(dataUrl);
    images.push(filePath);
    return `<img src="${filePath}" />`;
  });

  //save form data to db
  if(req.file){
    await Asset.create({ 
    name, 
    category, 
    description: updatedContent, 
    location, 
    filepath :`/uploads/models/${req.file.filename}`,
    lat,
    long
  });
  }else{
    await Asset.create({ 
    name, 
    category, 
    description: updatedContent, 
    location, 
    filepath: "",
    lat,
    long
  });
  }
  
  
  req.flash('success_msg', 'Asset added successfully!');
  res.redirect('/assets');
};

exports.getAssetUdate = async(req, res)=>{
  const asset = await Asset.findById(req.params.id);
  res.render('update-asset', {asset, title:'asset update',user: req.user, msg:"" });
}

exports.updateAsset = async (req, res) => {
const id = req.params.id;

if (req.fileValidationError) {
    return res.render('update-asset',{title: "kk", user: req.user, msg: req.fileValidationError})
  } 
  // Helper: Save base64 image as file
  function saveBase64Image(dataUrl) {
    const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
    const ext = matches[1].split('/')[1];
    const buffer = Buffer.from(matches[2], 'base64');

    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir); // Create the directory if it doesn't exist
    }

    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filepath = path.join('uploads', filename);
    fs.writeFileSync(filepath, buffer);
    return `/uploads/${filename}`;
  }

   //get incoming form data
   const { name, category, description, location, long, lat } = req.body;

   const safeDescription = description || req.body.description;

  // Parse and replace base64 images
  const imgRegex = /<img[^>]+src="data:(image\/[^;]+);base64,([^"]+)"[^>]*>/g;
  let images = [];
  let updatedContent = safeDescription.replace(imgRegex, (match, mimeType, base64) => {
    const dataUrl = `data:${mimeType};base64,${base64}`;
    const filePath = saveBase64Image(dataUrl);
    images.push(filePath);
    return `<img src="${filePath}" />`;
  });

  //save form data to db
  if(req.file){
    await Asset.findByIdAndUpdate(id,{ 
    name, 
    category, 
    description: updatedContent, 
    location, 
    filepath :`/uploads/models/${req.file.filename}`,
    lat,
    long
  });
  }else{
    await Asset.findByIdAndUpdate(id,{ 
    name, 
    category, 
    description: updatedContent, 
    location, 
    filepath: "",
    lat,
    long
    });
  }
  console.log(req.body.name);
  
  req.flash('success_msg', 'Asset updated successfully!');
  res.redirect('/assets');
};

exports.deleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      req.flash('error_msg', 'Asset not found!');
      return res.redirect('/assets');
    }

    // Extract image srcs from HTML content
    const imgRegex = /<img[^>]+src="([^">]+)"/g;
    let match;
    while ((match = imgRegex.exec(asset.description)) !== null) {
      const imgUrl = match[1]; // e.g. /uploads/abc123.png
      if (imgUrl.startsWith('/uploads/')) {
        const fullPath = path.join(__dirname, '..', imgUrl);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      }
    }

    await Asset.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Asset deleted!');
    res.redirect('/assets');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error deleting asset.');
    res.redirect('/assets');
  }
};

exports.getAddAssetPage = (req, res) => {
  res.render('add-asset', { title: 'Add Asset', user: req.user, msg: "" });
};

exports.getSingleAsset = async (req, res, next) => {
  const asset = await Asset.findById(req.params.id);
  const title = 'asset details';
  const user = req.user;
  const comments = await comment.find();

  if (!asset) return res.status(404).send('Asset not found');
  
  res.render('asset-details', { asset, title, user, comments});
};


exports.searchAssets = async (req, res) => {
  const { search, sort } = req.query;
  const isAjax = req.xhr || req.headers.accept?.includes('json');

  const query = {};

  if (search && search.trim() !== "") {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } }
    ];
  }

  try {
    const user = req.user;

    const assets = await Asset.find(query)
      .sort(sort === 'asc' ? { createdAt: 1 } : { createdAt: -1 })
      .limit(isAjax ? 10 : 0); // limit for suggestions only

    if (isAjax) {
      const suggestions = [
        ...new Set(
          assets.flatMap(a => [a.name, a.location, a.category])
        ),
      ];
      return res.json(suggestions.slice(0, 10));
    }

    res.render("assets", {
      title: "Assets",
      assets,
      user,
      search,
      msg: ""
    });
  } catch (error) {
    console.error(error);
    if (isAjax) {
      return res.status(500).json([]);
    } else {
      res.status(500).render("error", { error });
    }
  }
};

//Search suggestion controller
exports.suggestAssets = async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === '') return res.json([]);

  try {
    const assets = await Asset.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    }).limit(10);

    // Extract unique suggestions
    const names = assets.map(a => a.name);
    const locations = assets.map(a => a.location);
    const categories = assets.map(a => a.category);

    const suggestions = [...new Set([...names, ...locations, ...categories])];

    res.json(suggestions.slice(0, 10));
  } catch (error) {
    console.error(error);
    res.status(500).json([]);
  }
};

exports.getAssetTour = async (req, res)=>{
  const title = "asset tour";
  const asset = await Asset.findById(req.params.id);
  res.render('asset-tour', {asset, title, user: req.user});
};

exports.getCommunity =(req, res)=>{
  req.user = "community";
  res.render("community_form", {title:"community form", msg:"", user: req.user });
}

//community contribution
exports.communityAddAsset = async (req, res) => {
  if (req.fileValidationError) {
    return res.render('add-asset',{title: "kk", user: req.user, msg: req.fileValidationError})
  } 
  // Helper: Save base64 image as file
  function saveBase64Image(dataUrl) {
    const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
    const ext = matches[1].split('/')[1];
    const buffer = Buffer.from(matches[2], 'base64');

    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir); // Create the directory if it doesn't exist
    }

    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filepath = path.join('uploads', filename);
    fs.writeFileSync(filepath, buffer);
    return `/uploads/${filename}`;
  }

   //get incoming form data
   const { name, category, description, location, long, lat } = req.body;

  // Parse and replace base64 images
  const imgRegex = /<img[^>]+src="data:(image\/[^;]+);base64,([^"]+)"[^>]*>/g;
  let images = [];
  let updatedContent = description.replace(imgRegex, (match, mimeType, base64) => {
    const dataUrl = `data:${mimeType};base64,${base64}`;
    const filePath = saveBase64Image(dataUrl);
    images.push(filePath);
    return `<img src="${filePath}" />`;
  });

  //save form data to db
  if(req.file){
    await Asset.create({ 
    name, 
    category, 
    description: updatedContent, 
    location, 
    filepath :`/uploads/models/${req.file.filename}`,
    lat,
    long
  });
  }else{
    await Asset.create({ 
    name, 
    category, 
    description: updatedContent, 
    location, 
    filepath: "",
    lat,
    long
    });
  }
  
  
  req.flash('success_msg', 'sumitted successfully!');
  res.redirect('/');
};



