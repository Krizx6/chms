const express = require('express');
const Asset = require('../models/Asset');
const authMiddleware = require('../config/auth');
const assetController = require('../controllers/assetController');
//const upload = require('../config/fileUploader');

const router = express.Router();


const multer = require('multer');
const fs = require ('fs');


//ensuring uploads/models folder exists
const uploadDir = "./uploads/models";
if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, {recursive: true});
}

//multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{cb(null, uploadDir)},
    filename: (req, file, cb)=>{cb(null,`${Date.now()}-${file.originalname}` )}
})

const path = require('path');
upload = multer({
    storage,
    fileFilter:(req, file, cb)=>{
        const ext = path.extname(file.originalname);

        if(ext !==".glb" && ext !==".gltf"){
            req.fileValidationError = "only glb and gltf format accepted for 3D file";
            return cb(null, false);
        }

        cb(null, true)
    }
})


router.get('/update/:id',assetController.getAssetUdate);
router.post('/update/:id',assetController.updateAsset);
// route
router.get('/suggest', assetController.suggestAssets);
router.get("/community", assetController.getCommunity);

// Get assets (with search and sorting)
router.get('/search?', authMiddleware, assetController.searchAssets);

// Show add asset page
router.get('/add',authMiddleware, assetController.getAddAssetPage);

// Handle asset addition
router.post('/add',authMiddleware,upload.single("3d_file"), assetController.addAsset);

// Handle community asset addition
router.post('/community',upload.single("3d_file"), assetController.communityAddAsset);

// Get all assets (with search and sorting)
router.get('/',authMiddleware, assetController.getAssets);

// Get single asset
router.get('/:id',authMiddleware, assetController.getSingleAsset);

// Update asset
router.post('/edit/:id',authMiddleware, assetController.updateAsset);

// Delete asset
router.get('/delete/:id',authMiddleware, assetController.deleteAsset);

//tour asset
router.get('/tour/:id',authMiddleware, assetController.getAssetTour);

//commment
router.post('/comment/',authMiddleware, assetController.addacomment);

//donation
router.post('/donation',authMiddleware, assetController.donate);



module.exports = router;
