const router = require('express').Router();
const { login, updateprofile, addExperience, updateExperience, removeExperience, addProject, updateProject, removeProject, getProjectList } = require('../controllers/userController');
const { authMiddleware } = require('../helpers/helper');


router.post('/login', login)
router.patch('/upate-profile', authMiddleware, updateprofile)

// Experience routes
router.post('/experience', authMiddleware, addExperience); // Add experience
router.patch('/experience', authMiddleware, updateExperience); // Update experience
router.delete('/experience', authMiddleware, removeExperience); // Remove experience

// Project routes
router.get('/projects', authMiddleware, getProjectList); // Add project
router.post('/projects', authMiddleware, addProject); // Add project
router.patch('/projects', authMiddleware, updateProject); // Update project
router.delete('/projects', authMiddleware, removeProject); // Remove project


module.exports = router;


