const {DataTypes} = require('sequelize')
const db = require('../db/database')

const Blog = db.define('blog', {
  blogid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.TEXT('tiny'),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT('medium'),
    allowNull: true,
  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
  },
}, {
  indexes: [
    {
      unique: false,
      fields: ['authorid']
    }
  ]
})

module.exports = Blog
