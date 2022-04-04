const express = require("express");
const router = express.Router();
const profilesController = require("../controllers/profilesController");
const { authMiddleWare } = require("../Middleware/authMiddleware");
const fileUpload = require("../Middleware/fileUpload");

// create profile
router.post("/create-profile", authMiddleWare, fileUpload, profilesController.createProfile);

// edit profile
router.put("/edit-profile", authMiddleWare, profilesController.editProfile)

// single profile
router.get("/single-profile", authMiddleWare, profilesController.fetchProfile)

// all talents profiles 
router.get("/talent-profiles", profilesController.talentProfiles);

module.exports = router;