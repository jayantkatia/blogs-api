const {Router} = require('express')
const router = Router()

// Imports (controllers)
const {stringValidator, areFieldsValidated, checkSpaces} = require('../controllers/validators')
const {getAllBlogs,isBlogOwner, getBlogsByAuthor, getBlogByID, showBlog, showBlogsByAuthor, updateBlog, deleteBlog, createBlog} = require('../controllers/blogs')
const {isSignedIn} = require('../controllers/users')

// Routes
router.param('blogid', getBlogByID)
router.param('authoruname', getBlogsByAuthor)

router.get('/', getAllBlogs)
router.get('/select/:blogid', showBlog)
router.get('/by/:authoruname', showBlogsByAuthor)

router.post('/create', isSignedIn, [
    stringValidator('title', 4),
    stringValidator('description', 20),
    stringValidator('content', 40)
  ], 
  areFieldsValidated,
  createBlog
)
router.put('/select/:blogid', isSignedIn, [
    stringValidator('title', 4),
    stringValidator('description', 20),
    stringValidator('content', 40)
  ], 
  areFieldsValidated,
  updateBlog
)

router.delete('/select/:blogid', isSignedIn, isBlogOwner, deleteBlog)

// Exports
module.exports = router
