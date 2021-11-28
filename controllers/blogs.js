const Blogs = require('../models/blog')
const Users = require('../models/user')

// Params middleware
// uses blogid to get blog record and sets it to req.blog along with author's username
exports.getBlogByID = async (req, res, next, id) => {
  const blog = await Blogs.findOne({
    where: {
      blogid: id 
    }
  })
  if(blog == null){
    res.status(404).json({message: 'Blog not found'})
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
    res.status(404).json({message: 'Blogs not found'})
  }
  req.blogs = allBlogs
  next()
}

exports.isBlogOwner = (req, res, next) => {
  const checker = req.auth && req.blog && req.auth.id == req.blog.authorid
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
    include: [
      {
        model: Users,
        attributes: [['username', 'authorname']]
      }
    ],
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

exports.createBlog = (req, res) => {
  const {content, title, description} = req.body
  const authorid = req.auth.id
  console.log(authorid)
  Blogs.create({
    authorid,
    title,
    description,
    content
  }).then(blog => {
    const {createdAt} = blog
    res.status(200).json({data: {createdAt}})
  }).catch(err => {
    const errors = err.errors || Array(err)
    const errorMessages = errors.map(error => {
      return { msg: error.message, param: error.path}
    })
    res.status(400).json({errors: errorMessages})
  })
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
    res.status(200).json({message: 'Updated', title, description})
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