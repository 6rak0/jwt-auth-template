const { Schema, model } = require('mongoose')

const User = new Schema({
  username: String,
  hash: String,
  salt: String,
  isAdmin: {
    type: Boolean,
    default: false
  }
})

model('User', User)