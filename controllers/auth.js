const Users = require('../models/user')
const jwt = require('jsonwebtoken')

exports.signup = (req, res) => {
  const {email, username, password, firstname, lastname} = req.body
  Users.create({
      email,
      username,
      password,
      firstname,
      lastname
  }).then(user => {
      const {username, firstname, lastname, fullname, email} = user
      res.sendStatus(204)
  }).catch(err => {
    const errors  = err.errors || Array(err)
    const errorMessages = errors.map(error => {
      return { msg: error.message, param: error.path}
    })
    res.status(400).json({errors:errorMessages})
  })
}

exports.signin = async (req, res) => {
  const {email, password} = req.body
  const user = await Users.findOne({where: {email}, raw: false})
  
  // User does not exist
  if(user === null){
    res.status(404).json({errors: [{msg: 'User not found, kindly signup first'}]})
  }

  // Incorrect email/password
  if(!user.isAuthenticate(password)){
    res.status(400).json({errors: [{msg: 'Incorrect email or password'}]})
  }

  const {username, fullname, userid} = user

  // Success
  const token = jwt.sign({id: userid}, process.env.SECRET)
  res.cookie('token', token, {
    expiresIn: '2 days'
  })
  res.sendStatus(204)

}

exports.signout = (req, res) => {
  res.clearCookie()
  res.status(200).json({
    msg: 'User sign out'
  })
}
