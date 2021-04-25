const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'must have a name'],
    },
    email: {
      type: String,
      required: [true, 'must have email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: String,
    password: {
      type: String,
      required: [true, 'must have pw'],
      minlength: 6,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'must confirm pw']
    }
  }
)

const User = mongoose.model('User', userSchema)

module.exports = User 