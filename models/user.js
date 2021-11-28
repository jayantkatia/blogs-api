const {DataTypes} = require('sequelize')
const db = require('../db/database');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto')

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
    validate:{
      isEmail: true
    }
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  salt: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // Virtuals
  fullname: {
    type: DataTypes.VIRTUAL,
    get(){
      return `${this.firstname} ${this.lastname}`;
    }
  },
  password: {
    type: DataTypes.VIRTUAL,
    set: function (password) {
      this.setDataValue('password', password);
      this.salt = uuidv4()
      console.log(this.securePassword(password))
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
})

User.prototype.securePassword = function(password) {
  return crypto
  .createHmac("sha256",this.salt)
  .update(password)
  .digest("hex")
}

User.prototype.isAuthenticate = function(enteredPass){
  return this.securePassword(enteredPass) === this.password_hash
}

module.exports = User
