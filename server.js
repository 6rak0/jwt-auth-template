const express = require('express')
const cors = require('cors')

require('./config/database')
require('./models/user')

const server = express()

server.use(express.json())
server.use(express.urlencoded({extended:true}))
server.use(cors())
server.use('/api', require('./api/index'))
server.listen(process.env.PORT || 4000, () => console.log('servidor listo'))