const Blogs = require('../models/blog')
const Users = require('../models/user')
const {mailEveryone} = require('./mailer')

// Params middleware
// uses blogid to get blog record and sets it to req.blog along with author's username
exports.getBlogByID = async (req, res, next, id) => {
  const blog = await Blogs.findOne({
    where: {
      blogid: id 
    }
  })
  if(blog == null){
    res.status(404).json({ 
      errors: [
        {
          msg: 'Blog not found'
        }
      ]
    })
  }
  const {username} = await Users.findOne({
    attributes: ['username'],
    where: {userid: blog.authorid}
  })
  // Why pass whole blog obj? 
  /* Because this is a middleware and other middlewares might need some fields like authorid
    therefore, redact when sending response */  
  req.blog = {...blog, authorname: username}
  next()
}

exports.getBlogsByAuthor = async (req, res, next, id) => {
  const {userid} = await Users.findOne({
    attributes: ['userid'],
    where: {username: id}, 
    order: [['createdAt', 'DESC']]
  })
  
  const allBlogs = await Blogs.findAll({
    attributes: {exclude: ['content', 'authorid', 'updatedAt']},
    where: {
      authorid: userid 
    }
  })
  if(allBlogs == null){
    res.status(404).json({ 
      errors: [
        {
          msg: 'Blogs not found'
        }
      ]
    })
  }
  req.blogs = allBlogs
  next()
}

exports.isBlogOwner = (req, res, next) => {
  const checker = req.auth && req.blog && req.auth.id == req.blog.authorid
  if(!checker){
    res.status(403).json({ 
      errors: [
        {
          msg: 'Only owner can delete the blog'
        }
      ]
    })
  }
  next()
}

// Response controllers
// Always reduce/redact data to send here, not in Params controllers
exports.getAllBlogs =  async (req, res) => {
  const allBlogs = await Blogs.findAll({
    attributes: {exclude: ['content', 'authorid', 'updatedAt']},
    order: [['createdAt', 'DESC']]
  })
  if(allBlogs == null){
    res.status(500).json({
      errors: [
        { msg: 'Server error, kindly retry'}
      ]
    })
  }
  res.status(200).json({
    data: {
      blogs: allBlogs
    }
  })
}

exports.showBlog = (req, res) => {
  // Redact info
  const {authorid, updatedAt, ...blog} = req.blog

  res.status(200).json({
    data: {
      blog,
    }
  })
}

exports.showBlogsByAuthor = (req, res) => {
  // Information already redacted
  res.status(200).json({
    data: {
      blogs: req.blogs
    }
  })
}

exports.createBlog = async (req, res) => {
  const {content, title, description} = req.body
  const authorid = req.auth.id

  try{
    const {username} = await Users.findOne({
      attributes: ['username'],
      where: {userid: authorid}
    })

    const blog = await Blogs.create({
      authorid,
      title,
      description,
      content
    })
    const {createdAt, blogid} = blog

    // Mail template, create separate files for this later
    const subject = `???? Blog post by ${username}`
    const message = `Greetings,
<br>Checkout the new blog post by ${username}, titled <b>${title}</b><br><br>Sneak Peak:
<blockquote>${description}</blockquote>`

    mailEveryone(subject, message)
    res.status(200).json({data: {createdAt, blogid}})

  } catch(err){  
    const errors = err.errors || Array(err)
    const errorMessages = errors.map(error => {
      return { msg: error.message, param: error.path}
    })
    res.status(400).json({errors: errorMessages})
  }
}

exports.updateBlog = (req, res) => {
  const {content, title, description} = req.body
  const blogid = req.blog.blogid
  Blogs.update({
    title,
    description,
    content
  }, {
    where: {blogid}
  }).then(_ => {
    res.status(200).json({msg: 'Updated'})
  }).catch(err => {
    const errors  = err.errors || Array(err)
    const errorMessages = errors.map(error => {
      return { msg: error.message, param: error.path}
    })
    res.status(400).json({errors: errorMessages})
  })
}

exports.deleteBlog = (req, res) => {
  Blogs.destroy({
    where: {
      blogid: req.blog.blogid
    }
  })
  // 202 accepted, asynchronous
  res.sendStatus(202)
}