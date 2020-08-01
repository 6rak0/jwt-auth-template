const router = require('express').Router()
const User = require('mongoose').model('User')
const {genPassword, validatePassword, issueAccessToken } = require('../lib/uitls')

// --- POST ---

router.post('/signup', (req, res) => {
  const password = genPassword(req.body.password)
  const newUser = new User({
    username: req.body.username,
    hash: password.hash,
    salt: password.salt,
    isAdmin: req.body.isAdmin
  })
  
  newUser.save()
  .then(data => {
    const user = { username: data.username, id: data._id, isAdmin: data.isAdmin }
    const jwt = issueAccessToken(user)
    res.status(201).json({ succes: true, user: user, token: jwt })
  })
  .catch(err => {
    res.json({message : err.message})
  })
})

router.post('/login', (req, res) => {
  User.findOne({ username: req.body.username })
  .then(data => {
    if(!data) {
      res.status(401).json({ success: false, message: "usuario no encontrado"})
    }
    const isValid = validatePassword(req.body.password, data.hash, data.salt)
    if(isValid){
      const user = { username: data.username, id: data._id, isAdmin: data.isAdmin }
      const jwt = issueAccessToken(user)
      res.status(200).json({ 
        success: true, 
        user: user, 
        token: jwt 
      })
    } else {
      res.status(401).json({ success: false, message: "usuario o contraseña incorrectos" })
    }
  })
  .catch(err => console.log(err))
})

module.exports = router