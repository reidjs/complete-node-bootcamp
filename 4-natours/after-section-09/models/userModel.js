const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

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
      select: false
    },
    passwordConfirm: {
      type: String,
      required: [true, 'must confirm pw'],
      validate: {
        // this only work CREATE and on SAVE!
        validator: function (el) {
          return el === this.password;
        },
        message: "Password's not the same!"
      },
    }
  }
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }
  // hash the password
  this.password = await bcrypt.hash(this.password, 12)
  // no need to persist the confirmation in db!
  this.passwordConfirm = undefined
  next()
})

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  // cannot use this.password because 'select' is set to pass
  return await bcrypt.compare(candidatePassword, userPassword)
}

const User = mongoose.model('User', userSchema)

module.exports = User