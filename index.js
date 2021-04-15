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

let reminders = [
  {
    "name": "Buy some eggs",
    "timestamp": "2021-11-10T13:00:00.141Z",
    "id": 1
  },
  {
    "name": "Make an omelette",
    "timestamp": "2021-11-11T08:00:00.141Z",
    "id": 2
  },
  {
    "name": "Wash dishes",
    "timestamp": "2021-11-11T09:00:00.000Z",
    "id": 3
  },
  {
    "name": "Buy more eggs",
    "timestamp": "2021-11-11T13:00:00.000Z",
    "id": 4
  },
  {
    "name": "Testing",
    "timestamp": "2021-03-15T09:19:02.652Z",
    "id": 5
  },
  {
    "name": "ewewe",
    "timestamp": "2021-03-15T09:19:02.652Z",
    "id": 7
  },
  {
    "name": "qwqw",
    "timestamp": "2021-03-15T09:19:02.652Z",
    "id": 8
  },
  {
    "name": "hiihi",
    "timestamp": "2021-03-15T09:19:02.652Z",
    "id": 9
  }
]

const formatReminder = (reminder) => {
  return {
    name: reminder.name,
    timestamp: reminder.timestamp,
    id: reminder._id
  }
}

app.get('/', (request, response) => {
  response.send('<h1>Reminder!</h1>')
})

app.get('/api/reminders', (request, response) => {
  Reminder
    .find({})
    .then(reminders => {
      response.json(reminders)
    })
})

app.get('/api/reminders/:id', (request, response) => {
  const id = Number(request.params.id)
  const reminder = reminders.find(r => r.id === id)
  if (reminder) {
    response.json(reminder)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/reminders/:id', (request, response) => {
  const id = Number(request.params.id)
  reminders = reminders.filter(r => r.id !== id)

  response.status(204).end()
})

app.post('/api/reminders/', (request, response) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({error: 'reminder name missing'})
  }
  if (body.timestamp === undefined) {
    return response.status(400).json({error: 'reminder time missing'})
  }
  if (reminders.some(r => r.name === body.name)) {
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
