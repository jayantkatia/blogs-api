// load environment variables
require('dotenv').config()

// imports
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')

// Router imports
const authRoutes = require('./routes/auth')
const usersRoutes = require('./routes/users')
const blogsRoutes = require('./routes/blogs')


// Database
const db = require('./db/database')

const Blog = require('./models/blog');
const User = require('./models/user')
User.hasMany(Blog, {
  foreignKey: 'authorid'
})

db.authenticate()
  .then(()=>{
    console.log('DB Connected')
    return db.sync(
      // {force: true}
    )
  })
  .then(()=>console.log('DB Synced'))
  .catch(err=>{
    console.error(`Error: ${err}`)
  })


// Server
const app = express()
const port = process.env.PORT || 3000

// Middlewares
app.use(cors())
app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/api/auth/', authRoutes)
app.use('/api/users/', usersRoutes)
app.use('/api/blogs/', blogsRoutes)


// Application server listen
app.listen(port, () => {
  console.log(`Blogs API listening at http://localhost:${port}`)
})