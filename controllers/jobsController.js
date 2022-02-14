const Sequelize = require("sequelize")
const  { jobs, profiles } = require("../models");
const { createCustomError } = require("../error/custom-error");
const asyncWrapper = require("../Middleware/async");
const {StatusCodes} = require("http-status-codes");
const Op = Sequelize.Op;

// create a job
exports.createJob = asyncWrapper(async(req, res, next) => {
   const {title, category, type, location, jobDescription, tags, application_url} = req.body;
   if(!title || !category || !type || !location || !jobDescription || !tags || !application_url) return next(createCustomError("All fields should be filled", StatusCodes.NO_CONTENT));
   console.log(req.body);
   const userId = req.user.id;
   const profile = await profiles.findOne({where: {userId}});
   const job_promoter = profile?.company_name;
   const promoter_logo = profile?.company_logo;
   console.log({job_promoter, promoter_logo});
   const job = await jobs.create({title, category, type, location, logo: promoter_logo, promoter: job_promoter, tags, application_url, description:jobDescription, userId});
   res.status(StatusCodes.CREATED).json(job)
})


// fetch all jobs
exports.fetchAllJobs = asyncWrapper(async(req, res, next) => {
   let {page} = req.query;
   let limit = 25;
   let offset = 0 + (page -1) * limit;
    const fetchedJobs = await jobs.findAll({order: [["createdAt", "DESC"]] });
    if(!fetchedJobs.length) return next(createCustomError("We didn't find any jobs. Try again later.", StatusCodes.OK));
    res.json(fetchedJobs).status(StatusCodes.CREATED);
});

// fetch single job
exports.fetchSingleJob = asyncWrapper(async(req, res, next) => {
   const {uuid} = req.params;
   console.log({uuid});
   const job = await jobs.findOne({where: {uuid}});
   // include promoter's profile
   const profile = await profiles.findOne({where: {userId: job.userId}});
   // include similar jobs
   const similarJobs = await jobs.findAll(
      {where: {[Op.or] : [
      {category: {[Op.like] : "%" + job.category + "%"}},
      {promoter: {[Op.like] : "%" + job.promoter + "%"}}
   ]}, order: [["createdAt", "DESC"]]});
   res.status(StatusCodes.OK).json({job, profile, similarJobs});
});

// edit job
exports.editJobPost = asyncWrapper(async(req, res, next) => {

});

// delete job post
exports.deleteJobPost = asyncWrapper(async(req, res, next) => {
    const {uuid} = req.params;
    console.log({uuid});
   //  find a job with the uuid
   const job = await jobs.findOne({where: {uuid}});
   if(!job) return next(createCustomError("Not found", StatusCodes.BAD_REQUEST));
   await jobs.destroy({where: {uuid}});
   res.status(StatusCodes.OK).json({message: "Job post deleted succesfully"});
});

// jobs by single user
exports.myJobs = asyncWrapper(async(req, res, next) => {
   const userId = req.user.id;
   const myJobs = await jobs.findAll({where: {userId}, order: [["createdAt", "DESC"]]});
   const profile = await profiles.findOne({where: {userId}});
   // if(!myJobs.length) return next(createCustomError("Unfortunately, you have got no jobs", StatusCodes.OK));
   res.status(StatusCodes.OK).json({myJobs, profile});
})

// search jobs
exports.searchJobs = asyncWrapper(async(req, res, next) => {
const {query, category, location, type} = req.query;
console.log(req.query);
let searchedJobs;
if(category === "none" || category === "DEFAULT" && location === "none" || location === "DEFAULT" && type === "none" || type === "DEFAULT"){
searchedJobs = await jobs.findAll({where: {
   [Op.or] : [
      {title : {[Op.like] : "%" + query + "%"}},
      {promoter: {[Op.like] : "%" + query + "%"}},
      {tags: {[Op.like] : "%" + query + "%"}}
   ]
}});
}
// // search term with category
// if(searchTerm !== "none" && category !== "none" && category !== "DEFAULT"){
//    searchedJobs = await jobs.findAll({where: {
//       [Op.and]: [
//          {[Op.or] : [
//             {title : {[Op.like] : "%" + searchTerm + "%"}},
//             {promoter: {[Op.like] : "%" + searchTerm + "%"}},
//             {tags: {[Op.like] : "%" + searchTerm + "%"}}
//          ]},
//          {category : category}
//       ]
//    }})
// }
// // searchterm with type
// if(searchTerm !== "none" && type !== "none" && type !== "DEFAULT"){
//    searchedJobs = await jobs.findAll({where: {
//       [Op.and]: [
//          {[Op.or] : [
//             {title : {[Op.like] : "%" + searchTerm + "%"}},
//             {promoter: {[Op.like] : "%" + searchTerm + "%"}},
//             {tags: {[Op.like] : "%" + searchTerm + "%"}}
//          ]},
//          {type : type}
//       ]
//    }})
// }
// // searchterm with location
// if(searchTerm !== "none" &&  location!== "none" && location !== "DEFAULT"){
//    searchedJobs = await jobs.findAll({where: {
//       [Op.and]: [
//          {[Op.or] : [
//             {title : {[Op.like] : "%" + searchTerm + "%"}},
//             {promoter: {[Op.like] : "%" + searchTerm + "%"}},
//             {tags: {[Op.like] : "%" + searchTerm + "%"}}
//          ]},
//          {location : location}
//       ]
//    }})
// }
// // searchterm with category and location
// if(searchTerm !== "none" && category !== "none" && category !== "DEFAULT" && location !== "none" && location !== "Default"){
//    searchedJobs = await jobs.findAll({where: {
//       [Op.and]: [
//          {[Op.or] : [
//             {title : {[Op.like] : "%" + searchTerm + "%"}},
//             {promoter: {[Op.like] : "%" + searchTerm + "%"}},
//             {tags: {[Op.like] : "%" + searchTerm + "%"}}
//          ]},
//          {category : category}, 
//          {location : location}
//       ]
//    }})
// }
// // searchterm with category and location and type
// if(searchTerm !== "none" && category !== "none" && category !== "DEFAULT" && location !== "none" && location !== "Default" && type !== "none" && type !== "DEFAULT"){
//    searchedJobs = await jobs.findAll({where: {
//       [Op.and]: [
//          {[Op.or] : [
//             {title : {[Op.like] : "%" + searchTerm + "%"}},
//             {promoter: {[Op.like] : "%" + searchTerm + "%"}},
//             {tags: {[Op.like] : "%" + searchTerm + "%"}}
//          ]},
//          {category : category}, 
//          {location : location}
//       ]
//    }})
// }
// // category only
// if(searchTerm === "none" && category !== "none" || category !== "DEFAULT" && location === "none" || location === "DEFAULT" && type === "none" || type === "DEFAULT"){
//    searchedJobs = await jobs.findAll({where: {category}});
// }
// // location only
// if(searchTerm === "none" && location !== "none" || location !== "DEFAULT" && category === "none" || category === "DEFAULT" && type === "none" || type === "DEFAULT"){
//    searchedJobs = await jobs.findAll({where: {location}});
// }
// // type only
// if(searchTerm === "none" && type !== "none" || type !== "DEFAULT" && location === "none" || location === "DEFAULT" && category === "none" || category === "DEFAULT"){
//    searchedJobs = await jobs.findAll({where: {type}});
// }
if(!searchedJobs?.length) return next(createCustomError("We didn't find jobs matching your search", StatusCodes.OK));
res.status(StatusCodes.OK).json(searchedJobs);
})