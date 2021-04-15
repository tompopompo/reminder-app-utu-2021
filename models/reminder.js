const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const url = process.env.MONGODB_URI

mongoose.connect(url)

const Reminder = mongoose.model('Reminder', {
  name: String,
  timestamp: String
})

module.exports = Reminder
