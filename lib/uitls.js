const crypto = require('crypto')
const jwt = require('jsonwebtoken')

module.exports.genPassword = (password) => {
  const salt = crypto.randomBytes(64).toString('hex')
  const genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')

  return {
    salt: salt,
    hash: genHash
  }
}

module.exports.validatePassword = (password, hash, salt) => {
  const hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
  return hash === hashVerify
}

module.exports.issueAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '3d'})
}

module.exports.validateJWT = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) return res.status(403).json(err)
    req.user = user
    next()
  })
}

module.exports.isAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
      next();
  } else {
      res.status(401).json({ success: false, message: 'Acceso no autorizado, solo administradores.' });
  }
}