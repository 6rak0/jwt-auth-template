const router = require('express').Router()
const User = require('mongoose').model('User')
const {genPassword, validatePassword, issueAccessToken, validateJWT } = require('../lib/uitls')

// --- POST ---

router.post('/signup', (req, res) => {
  const password = genPassword(req.body.password)
  const newUser = new User({
    username: req.body.username,
    hash: password.hash,
    salt: password.salt,
    //isAdmin: req.body.isAdmin
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
      res.status(401).json({ success: false, message: "contraseña incorrecta" })
    }
  })
  .catch(err => res.json(err))
})

//--- PUT ---

router.put('/update-password', validateJWT, (req, res) => {
  const { oldPass, newPass } = req.body
  const { id } = req.user
  if(oldPass === newPass) return res.status(400).json({succes: false, message: 'constraseña nueva no puede ser igual a la anterior'})
  User.findById(id)
  .then(data => {
    const isValid = validatePassword(oldPass, data.hash, data.salt)
    if(isValid){
      const password = genPassword(newPass)
      User.findByIdAndUpdate(id, {hash: password.hash,salt: password.salt}, {new:true, useFindAndModify:false}, (err) => {
        if(err) return res.status(400).json(err)
      })
      res.status(200).json({ 
        success: true, 
        message: 'contraseña actualizada'
      })
    } else {
      res.status(401).json({ success: false, message: "contraseña vieja incorrecta" })
    }
  })
  .catch(err => {res.json(err)})
})

module.exports = router