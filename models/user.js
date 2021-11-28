const {DataTypes} = require('sequelize')
const db = require('../db/database');
const Blog = require('./blog');
const { v4: uuidv4 } = require('uuid');

const User = db.define('user', {
  userid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // VIRTUALS 
  fullname: {
    type: DataTypes.VIRTUAL,
    get(){
      return `${this.firstName} ${this.lastName}`;
    }
  },
  password: {
    type: DataTypes.VIRTUAL,
    set: function (password) {
      this.setDataValue('password', password);
      this.salt = uuidv4()
      this.setDataValue('password_hash', this.securePassword(password))
    },
    validate: {
      isLongEnough: function (password) {
        if (password.length < 7) {
          throw new Error("Please choose a longer password")
        }
      }
    }
  }
}, {
  getterMethods: {
    securePassword(password){
      return crypto
      .createHmac("sha256",this.salt)
      .update(password)
      .digest("hex")
    },
    isAuthenticate(enteredPass){
      return this.securePassword(enteredPass) === this.password_hash
    }
  }
})

User.hasMany(Blog, {
  foreignKey: 'authorid'
})

module.exports = User
