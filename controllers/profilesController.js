const { StatusCodes } = require("http-status-codes");
const { createCustomError } = require("../error/custom-error");
const asyncWrapper = require("../Middleware/async");
const {companyProfile, talentProfile, talentProjects, talentSkills } = require("../models");

// create profile
exports.createProfile = asyncWrapper(async(req, res, next) => {
    console.log(req.body);
    // user role
     const role = req.user.role;
    //  image properties
    console.log({fileInfo: req.files.logo});
    // employer profile data
    const {company_name, company_tagline, company_description, company_email, company_website_url, company_twitter_url, company_linkedin_url, company_facebook_url} = req.body;
    // talent profile data
    const {} = req.body;
    if(!req.body) return next(createCustomError("Please fill all fields", StatusCodes.FORBIDDEN));
    if(role === "employer"){
        profile = await companyProfile.create({company_name, company_tagline, company_description, company_logo: req.files.logo.name, company_email, company_website_url, company_twitter_url, company_linkedin_url, company_facebook_url, userId: req.user.id});
    }
    if(role === "talent"){
        profile = await talentProfile.create({...req.body});
    }
        res.status(StatusCodes.OK).json(profile);
});

// edit profile
exports.editProfile = asyncWrapper(async(req, res, next) => {
     console.log(req.body);
     // user role
    const role = req.user.role;
     const userId = req.user.id;
     console.log({userId});
     if(role === "employer"){
        await companyProfile.update({...req.body}, {where: {userId}});
     }
     if(role === "talent"){
         await talentProfile.update({...req.body}, {where: {userId}})
     }
     const profile = await companyProfile.findOne({where: {userId}});
     res.status(StatusCodes.OK).json(profile);
});

// fetch single profile
exports.fetchProfile = asyncWrapper(async(req, res, next) => {
    const userId = req.user.id;
    const profile = await companyProfile.findOne({where: {userId}});
    console.log({profile: profile});
    res.status(StatusCodes.OK).json(profile);
});


// all talent profiles
exports.talentProfiles = asyncWrapper(async(req, res, next) => {
    const talents = await talentProfile.findAll({include: [talentProjects, talentSkills]}, {order: [["createdAt", "DESC"]]});
    res.status(StatusCodes.OK).json(talents);
});

// all talent profiles

