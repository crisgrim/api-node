// Get config
require('dotenv').config()
// Connect to db
require('./services/db')

const express = require('express')
const cors = require('cors')
const Note = require('./models/Note')
const logger = require('./middleware/logger')
const handleErrors = require('./middleware/handleErrors')
const notFound = require('./middleware/notFound')

const app = express()

/* middleware */
app.use(express.json())
app.use(logger)
app.use(cors())

// Serve images in http://localhost:3001/images/logo.png
app.use('/images', express.static('images'))

app.get('/', (request, response) => {
    response.send('<h1>Hello world</h1>')
})

app.get('/api/notes', (request, response, next) => {
    Note.find({})
        .then((notes) => response.json(notes))
        .catch(error => next(error))
})

app.get('/api/notes/:id', (request, response, next) => {
    const id = request.params.id
    Note.findById(id)
        .then((note) => {
            if (note) {
                response.json(note)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response, next) => {
    const id = request.params.id
    Note.findByIdAndDelete(id)
        .then(() => response.status(204).end())
        .catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
    const id = request.params.id
    const note = request.body

    const newNoteInfo = {
        content: note.content,
        important: note.important
    }

    Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
        .then(() => response.status(204).end())
        .catch(error => next(error))
})

app.post('/api/notes', (request, response, next) => {
    const note = request.body

    if (!note || !note.content) {
        return response.status(400).json({
            error: 'note.content is missing'
        })
    }

    const newNote = new Note({
        content: note.content,
        important: note.important || false,
        date: new Date()
    })

    newNote.save()
        .then(savedNote => response.status(201).json(savedNote))
        .catch(error => next(error))
})

// Middleware to manage 404
app.use(notFound)

// Middleware to manage errors
app.use(handleErrors)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})
