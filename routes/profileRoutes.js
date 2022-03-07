const express = require("express");
const router = express.Router();
const profilesController = require("../controllers/profilesController");
const { authMiddleWare } = require("../Middleware/authMiddleware");

// create profile
router.post("/create-profile", authMiddleWare, profilesController.createProfile);

// edit profile
router.put("/edit-profile", authMiddleWare, profilesController.editProfile)

// single profile
router.get("/single-profile", authMiddleWare, profilesController.fetchProfile)

// all profiles 
router.get("/all-profiles", profilesController.allProfiles);

module.exports = router;