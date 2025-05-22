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
    filename: (req, file, cb)=>{cb(null,`${Date,now()}-${file.originalname}` )}
})

exports.upload = multer({
    storage,
    fileFilter:(req, file, cb)=>{
        const ext = path.extname(file.originalname);

        if(ext !==".glb" || ext !==".gltf"){
            return cb(new Error("only glb and gltf files accepted"));
        }

        cb(null, true)
    }
})
