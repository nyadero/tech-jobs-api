const Sequelize = require("sequelize")
const  { job, companyProfile } = require("../models");
const { createCustomError } = require("../error/custom-error");
const asyncWrapper = require("../Middleware/async");
const {StatusCodes} = require("http-status-codes");
const Op = Sequelize.Op;

// create a job
exports.createJob = asyncWrapper(async(req, res, next) => {
   const {title, category, type, location, jobDescription, tags, application_url} = req.body;
   if(!title || !category || !type || !location || !jobDescription || !tags || !application_url) return next(createCustomError("All fields should be filled", StatusCodes.OK));
   console.log(req.body);
   const userId = req.user.id;
   const role = req.user.role;
   if(role !== "employer") {
      return next(createCustomError("You are not allowed to complete this operation. Change your role to employer", StatusCodes.OK))
   }
   const profile = await companyProfile.findOne({where: {userId}});
   if(!profile) return next(createCustomError("You havent completed your profile. PLease do so before proceeding", StatusCodes.OK))
   const job_promoter = profile?.company_name;
   const promoter_logo = profile?.company_logo;
   console.log({job_promoter, promoter_logo});
   await job.create({title, category, type, location, logo: promoter_logo, promoter: job_promoter, tags, application_url, description:jobDescription, userId});
   res.status(StatusCodes.CREATED).json({message: "Successfully posted"});
})


// fetch all job
exports.fetchAllJobs = asyncWrapper(async(req, res, next) => {
   const {page} = req.params;
   console.log({page});
   let limit = 40;
   let offset = Math.ceil(limit * (page -1));
   console.log({offset});
   // count all job in the db
   const allJobs = await job.count();
    const fetchedJobs = await job.findAll({limit: limit, offset: offset, order: [["createdAt", "DESC"]]});
   //  if(!fetchedJobs.length) return next(createCustomError("We didn't find any job. Try again later.", StatusCodes.OK));
    const paginationData = {
        noOfPages: Math.ceil(allJobs/limit),
        currentPage: page,
        totalJobs: allJobs,
        showingFrom: limit * (page -1) + 1,
        showingUntil: limit * page > allJobs ? allJobs : limit * page
    }
    res.json({fetchedJobs, paginationData}).status(StatusCodes.CREATED);
    console.log({paginationData});
    console.log(fetchedJobs?.length);
});

// fetch single job
exports.fetchSingleJob = asyncWrapper(async(req, res, next) => {
   const {uuid} = req.params;
   console.log({uuid});
   let UserId;
   const result = await job.findOne({where: {uuid}});
   UserId = result.userId;
   console.log({UserId});
   // include promoter's profile
   const profile = await companyProfile.findOne({where: {UserId}});
   res.status(StatusCodes.OK).json({result, profile});
});

// edit job
exports.editJobPost = asyncWrapper(async(req, res, next) => {
  const {uuid} = req.params;
  console.log({uuid});
  const {title, category, type, location, application_url, is_open, tags, description} = req.body;
  await job.update({title, category, type, location, application_url, is_open,tags, description}, {where: {uuid}});
  res.status(StatusCodes.CREATED).json({message: "You job has been updated succesfully"});
});

// delete job post
exports.deleteJobPost = asyncWrapper(async(req, res, next) => {
    const {uuid} = req.params;
    console.log({uuid});
   //  find a job with the uuid
   const result = await job.findOne({where: {uuid}});
   if(!result) return next(createCustomError("Not found", StatusCodes.BAD_REQUEST));
   await job.destroy({where: {uuid}});
   res.status(StatusCodes.OK).json({message: "Job post deleted succesfully"});
});

// job by single user
exports.myJobs = asyncWrapper(async(req, res, next) => {
   const userId = req.user.id;
   const myJobs = await job.findAll({where: {userId}, order: [["createdAt", "DESC"]]});
   const profile = await companyProfile.findOne({where: {userId}});
   // if(!myJobs.length) return next(createCustomError("Unfortunately, you have got no job", StatusCodes.OK));
   res.status(StatusCodes.OK).json({myJobs, profile});
})

// search job
exports.searchJobs = asyncWrapper(async(req, res, next) => {
const {query, category, location, type} = req.query;
console.log(req.query);
let searchedJobs;
if(req.query){
searchedJobs = await job.findAll({where: {
   [Op.or] : [
      {title : {[Op.like] : "%" + query + "%"}},
      {promoter: {[Op.like] : "%" + query + "%"}},
      {tags: {[Op.like] : "%" + query + "%"}}
   ]
}});
}

// if(!searchedJobs?.length) return next(createCustomError("We didn't find job matching your search", StatusCodes.OK));
res.status(StatusCodes.OK).json(searchedJobs);
})