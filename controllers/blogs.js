const Blogs = require('../models/blog')
const User = require('../models/user')
const Users = require('../models/user')

// Params middleware
exports.getBlogByID = async (req, res, next, id) => {
  const blog = await Blogs.findOne({
    where: {
      blogid: id 
    }
  })
  if(blog == null){
    res.status(401).json({message: 'Blog not found'})
  }
  const {username} = await Users.findOne({
    attributes: ['username'],
    where: {userid: blog.authorid}
  })
  req.blog = {...blog, authorname: username}
  next()
}

exports.getBlogsByAuthor = async (req, res, next, id) => {
  const {userid} = await Users.findOne({
    attributes: {exclude: ['content', 'updatedAt']},
    where: {username: id},
    order: [['createdAt', 'DESC']]
  })
  const allBlogs = await Blogs.findAll({
    where: {
      authorid: userid 
    }
  })
  if(allBlogs == null){
    res.status(401).json({message: 'Blogs not found'})
  }
  req.blogs = allBlogs
  next()
}

exports.isBlogOwner = (req, res, next) => {
  const checker = req.auth && req.blog && req.auth.id == req.blog.dataValues.authorid
  if(!checker){
    res.status(403).json({message: 'Only owner can delete the blog'})
  }
  next()
}

// Response controllers
// Always reduce/redact data to send here, not in Params controllers
exports.getAllBlogs =  async (req, res) => {
  const allBlogs = await Blogs.findAll({
    attributes: {exclude: ['content', 'authorid', 'updatedAt']},
    include: {all: true},
    order: [['createdAt', 'DESC']]
  })
  if(allBlogs == null){
    res.status(500).send({message: 'Server error, kindly retry'})
  }
  res.status(200).send({
    data: {
      blogs: allBlogs
    }
  })
}

exports.showBlog = (req, res) => {
  res.status(200).json({
    data: {
      blog: req.blog
    }
  })
}

exports.showBlogsByAuthor = (req, res) => {
  res.status(200).json({
    data: {
      blogs: req.blogs
    }
  })
}

exports.createBlog = (req, res) => {
  const {content, title, description} = req.body
  const authorid = req.auth.id
  Blogs.create({
    authorid,
    title,
    description,
    content
  }).then(blog => {
    const {title, description, createdAt} = blog
    res.send({title, description, createdAt})
  }).catch(err => {
    const errorMessages = err.errors.map(error => {
      return { message: error.message, field: error.path}
    })
    res.send({errorMessages})
  })
}

exports.updateBlog = (req, res) => {
  const {content, title, description} = req.body
  const blogid = req.blog.dataValues.blogid
  Blogs.update({
    title,
    description,
    content
  }, {
    where: {blogid}
  }).then(blog => {
    res.status(200).json({message: 'Updated', title, description})
  }).catch(err => {
    const errors  = err.errors || Array(err)
    const errorMessages = errors.map(error => {
      return { message: error.message, field: error.path}
    })
    res.status(400).send({errorMessages})
  })
}



exports.deleteBlog = (req, res) => {
  Blogs.destroy({
    where: {
      blogid: req.blog.dataValues.blogid
    }
  })
  res.status(200).json({
    message: 'Deleted'
  })
}