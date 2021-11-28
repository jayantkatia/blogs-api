const users = require('../models/user')
const jwt = require('jsonwebtoken')

exports.signup = (req, res) => {
  const {email, username, password, firstname, lastname} = req.body
  users.create({
      email,
      username,
      password,
      firstname,
      lastname
  }).then(user => {
      const {username, firstname, lastname, fullname, email} = user
      res.send({username, firstname, lastname, fullname, email})
  }).catch(err => {
    const errors  = err.errors || Array(err)
    const errorMessages = errors.map(error => {
      return { message: error.message, field: error.path}
    })
    res.send({errorMessages})
  })
}

exports.signin = async (req, res) => {
  const {email, password} = req.body
  const user = await users.findOne({where: {email}})
  
  // User does not exist
  if(user === null){
    res.send({message: 'User not found, kindly signup first'})
  }

  // Incorrect email/password
  if(!user.isAuthenticate(password)){
    res.send({message: 'Incorrect email or password'})
  }

  const {username, fullname, userid} = user

  // Success
  const token = jwt.sign({id: userid}, process.env.SECRET)
  res.cookie('token', token, {
    expiresIn: '2 days'
  })
  res.send({
    username,
    fullname,
    email
  })

}

exports.signout = (req, res) => {
  res.clearCookie()
  res.send({
    message: 'User sign out'
  })
}
