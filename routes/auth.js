const {Router} = require('express')
const router = Router()

// Imports (controllers)
const {emailValidator, passwordValidator, stringValidator, areFieldsValidated, checkSpaces} = require('../controllers/validators')
const {signup, signin, signout} = require('../controllers/auth')

// Routes
router.post('/signup', [
    emailValidator('email'),
    passwordValidator('password'),
    stringValidator('username', 5),
    checkSpaces('username'),
    stringValidator('firstname',2),
    stringValidator('lastname',2)
  ], 
  areFieldsValidated,
  signup
);

router.post('/signin', 
  emailValidator('email'),
  areFieldsValidated,
  signin
)

router.get('/signout', signout)

// Exports
module.exports = router