const sharp = require("sharp")
const fileUpload = async (req, res, next) => {
    let companyLogo;
    let uploadPath;
    let compressedFilePath;

    
     // check if file exists
     if(!req.files || Object.keys(req.files).length === 0){
        return next(createCustomError("No files uploaded", StatusCodes.OK))
      }

    companyLogo = req.files.logo;
    console.log(companyLogo);
    console.log({...req.body});

    // upload path
    uploadPath = __dirname + "../../uploads/" + companyLogo.name;

    // compressed image path
    compressedFilePath = __dirname + "../../logos/" + companyLogo.name;

    // mv() function to store file in uploads folder
   await companyLogo.mv(uploadPath, async() => {
        // compress the logo first
        sharp(uploadPath).resize(800, 1000, {
            fit: "cover",
            quality: 100,
            position: "center",
            fastShrinkOnLoad: true,
        }).toFile(compressedFilePath, (err, info) => {
            if(err){
                console.log({Error: err});
            }else{
                req.file = info;
                console.log("Succesfully uploaded");
            }
        });
    });

    next();
}

module.exports = fileUpload;