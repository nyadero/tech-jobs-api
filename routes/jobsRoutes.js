const express = require("express");
const router = express.Router();
const jobsController = require("../controllers/jobsController");
const { authMiddleWare } = require("../Middleware/authMiddleware");

// create job
router.post("/create-job", authMiddleWare, jobsController.createJob)

// get all jobs
router.get("/all-jobs", jobsController.fetchAllJobs);

// fetch single job
router.get("/job/:uuid", jobsController.fetchSingleJob);

// edit job
router.put("/edit-job/:uuid", authMiddleWare, jobsController.editJobPost);

// delete job post
router.delete("/delete-job/:uuid", authMiddleWare, jobsController.deleteJobPost);

// jobs by single user
router.get("/my-jobs", authMiddleWare, jobsController.myJobs);

// search jobs
router.get("/search", jobsController.searchJobs);

module.exports = router;