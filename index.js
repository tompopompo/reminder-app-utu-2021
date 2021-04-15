const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const Reminder = require('./models/reminder')

app.use(express.static('build'))
app.use(bodyParser.json())
app.use(cors())

const logger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:', request.path)
  console.log('Body:', request.body)
  console.log('---')
  next()
}

app.use(logger)


const formatReminder = (reminder) => {
  return {
    name: reminder.name,
    timestamp: reminder.timestamp,
    id: reminder._id
  }
}

app.get('/api/', (request, response) => {
  response.send('<h1>Reminders!</h1>')
})

app.get('/api/reminders', (request, response) => {
  Reminder
    .find({})
    .then(reminders => {
      response.json(reminders)
    })
})

app.delete('/api/reminders/:id', (request, response) => {
  Reminder
    .findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'reminder does not exist'})
    })
})

app.post('/api/reminders/', (request, response) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({error: 'reminder name missing'})
  }
  if (body.timestamp === undefined) {
    return response.status(400).json({error: 'reminder time missing'})
  }
  if (false) {
    return response.status(400).json({error: 'reminder already exists'})
  }

  const reminder = new Reminder({
    name: body.name,
    timestamp: new Date(body.timestamp).toISOString()
  })
  reminder
    .save()
    .then(savedReminder => {
      response.json(formatReminder(savedReminder))
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`serveri portis ${PORT}`)
})
