const {Router} = require('express')
const router = Router()

// Imports (controllers)
const {getUserByID, isSignedIn, isAuthenticated, getUserInfo} = require('../controllers/users')

// Routes
router.param('username', getUserByID)
router.get('/:username', isSignedIn, getUserInfo)

// Exports
module.exports = router