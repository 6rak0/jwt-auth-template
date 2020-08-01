const mongoose = require('mongoose')

require('dotenv').config()

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

mongoose.connect(process.env.DB_URI, options)
mongoose.connection.on('connected', () => console.log('base de datos lista y conectada'))