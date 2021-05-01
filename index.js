const express = require('express')
const logger = require('./loggerMiddleware')
const cors = require('cors')

const app = express()

/* middleware */
app.use(express.json())
app.use(logger)
app.use(cors())

let notes = [
    {
        id: 0,
        content: 'Go to shopping today',
        date: '2021-04-23T17:00:00.098Z',
        important: true
    },
    {
        id: 1,
        content: 'Review feedback from event',
        date: '2021-04-23T18:00:00.091Z',
        important: false
    },
    {
        id: 2,
        content: 'Create a new event for the next month',
        date: '2021-04-23T19:00:00.298Z',
        important: true
    },
    {
        id: 3,
        content: 'Read a novel',
        date: '2021-04-23T20:00:00.298Z',
        important: false
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello world</h1>')
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)
    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
    response.status(204).end()
})

app.post('/api/notes', (request, response) => {
    const note = request.body

    if (!note || !note.content) {
        return response.status(400).json({
            error: 'note.content is missing'
        })
    }
  
    const ids = notes.map(note => note.id)
    const maxId = Math.max(...ids)
    const newNote = {
        id: maxId + 1,
        content: note.content,
        important: note.important ? Boolean(note.important) : false,
        date: new Date().toISOString()
    }

    notes = [...notes, newNote]

    response.status(201).json(newNote)
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})
