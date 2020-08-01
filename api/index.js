const router = require('express').Router()

router.use('/auth', require('./auth'))
router.use('/partidos', require('./partidos'))

module.exports = router