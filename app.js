// load environment variables
require('dotenv').config()

// imports
const express = require('express')


// Database
const db = require('./db/database')
const User  = require('./models/user')
db.authenticate()
  .then(()=>{
    console.log('DB Connected')
    return db.sync(
      {force: true}
    )
  })
  .then(()=>console.log('DB Synced'))
  .catch(err=>{
    console.error(`Error: ${err}`)
  })


// Server
const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Blogs API listening at http://localhost:${port}`)
})