const { StatusCodes } = require("http-status-codes");
const { createCustomError } = require("../error/custom-error");
const asyncWrapper = require("../Middleware/async");
const {profiles } = require("../models");
const sharp = require("sharp");

// create profile
exports.createProfile = asyncWrapper(async(req, res, next) => {
    const {company_name, company_tagline, company_description, company_email, company_website_url, company_twitter_url, company_linkedin_url, company_facebook_url} = req.body;
    if(!req.body) return next(createCustomError("Please fill all fields", StatusCodes.FORBIDDEN));
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
    companyLogo.mv(uploadPath, async() => {
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
                console.log(info);
            }
        });

        const profile = await profiles.create({company_name, company_tagline, company_description, company_logo: companyLogo.name, company_email, company_website_url, company_twitter_url, company_linkedin_url, company_facebook_url, userId: req.user.id});
        res.status(StatusCodes.OK).json(profile);
    })
});

// edit profile
exports.editProfile = asyncWrapper(async(req, res, next) => {
     console.log(req.body);
     const userId = req.user.id;
     console.log({userId});
     const updatedProfile = await profiles.update({...req.body}, {where: {userId: req.user.id}});
     const profile = await profiles.findOne({where: {userId}});
     res.status(StatusCodes.OK).json(profile);
});

// fetch single profile
exports.fetchProfile = asyncWrapper(async(req, res, next) => {
    const userId = req.user.id;
    const profile = await profiles.findOne({where: {userId}});
    res.status(StatusCodes.OK).json(profile);
});

