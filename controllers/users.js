const users = require('../models/user')
const expressJwt = require('express-jwt')

// Protected routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  algorithms: ['HS256'],
  userProperty: 'auth'
})

// Middlewares
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile.userid == req.auth.id;
  if (!checker) {
    return res.status(403).json({
      message: "Access denied",
    });
  }
  next();
}

exports.getUserByID = async (req, res, next, id) => {
  const user = await users.findOne({where: {username: id}})

  // User does not exist
  if(user === null){
    res.status(404).json({message: 'User not found'})
  }

  const {username, lastname, firstname, createdAt, updatedAt, userid, email} = user
  req.profile = {userid, email, username, lastname, firstname, createdAt, updatedAt}
  next()
}


/* Based on user authentication show information
  If user is the owner of the account show all information 
  else show minimal information
*/
exports.getUserInfo = async (req, res) => {
  let checker = req.profile && req.auth && req.profile.userid == req.auth.id;
  
  const {email, username, firstname, lastname, createdAt, updatedAt} = req.profile
  if (!checker) {
    return res.status(200).json({
      username, firstname, lastname, createdAt
    });
  }
  return res.status(200).json({
    username, email, firstname, lastname, createdAt, updatedAt
  });
}
