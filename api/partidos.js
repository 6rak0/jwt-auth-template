const router = require('express').Router()
const { validateJWT, isAdmin } = require('../lib/uitls')

const posts = [
  {
    username: 'Kyle',
    title: 'Post 1'
  },
  {
    username: 'Jim',
    title: 'Post 2'
  }
]

router.get('/', validateJWT, (req, res) => {
  res.json(posts)
})


module.exports = router