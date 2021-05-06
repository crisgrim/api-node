const jwt = require('jsonwebtoken')
const notesRouter = require('express').Router()
const Note = require('../models/Note')
const User = require('../models/User')

notesRouter.get('/', (request, response, next) => {
    Note.find({}).populate('user', {
        username: 1,
        name: 1
    })
        .then((notes) => response.json(notes))
        .catch(error => next(error))
})

notesRouter.get('/:id', (request, response, next) => {
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

notesRouter.delete('/:id', (request, response, next) => {
    const id = request.params.id
    Note.findByIdAndDelete(id)
        .then(() => response.status(204).end())
        .catch(error => next(error))
})

notesRouter.put('/:id', (request, response, next) => {
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

notesRouter.post('/', async (request, response, next) => {
    const {
        content,
        important = false,
    } = request.body

    const authorization = request.get('authorization')
    let token = null

    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        token = authorization.substring(7)
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

    if (!token || !decodedToken.id) {
        return response.status(401).json({
            error: 'token missing or invalid'
        })
    }

    const { id: userId } = decodedToken
    const user = await User.findById(userId)

    if (!content) {
        return response.status(400).json({
            error: 'note.content is missing'
        })
    }

    const newNote = new Note({
        content: content,
        important: important,
        date: new Date(),
        user: user._id
    })

    try {
        const savedNote = await newNote.save()

        user.notes = user.notes.concat(savedNote._id)
        await user.save()

        response.status(201).json(savedNote)
    } catch(error) {
        next(error)
    }
})

module.exports = notesRouter