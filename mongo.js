const mongoose = require('mongoose')
require('dotenv').config()
const url = process.env.MONGODB_URI

mongoose.connect(url)

const Reminder = mongoose.model('Reminder', {
  name: String,
  timestamp: String
})

const argumentit = process.argv.splice(2)

if (argumentit.length === 0) {
  Reminder
    .find({})
    .then(result => {
      console.log('Reminders:')
      result.forEach(reminder => {
        console.log(`${reminder.name}, ${reminder.timestamp}`)
      });
      mongoose.connection.close()
    })
} else {
  const name = argumentit[0]
  const timestamp = new Date(argumentit[1]).toISOString()
  const reminder = new Reminder({
    name: name,
    timestamp: timestamp
  })
  reminder
    .save()
    .then(result => {
      console.log(`adding person Reminder ${name} at ${timestamp} to the reminder database`)
      mongoose.connection.close()
    })
}
