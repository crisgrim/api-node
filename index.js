// Get config
require('dotenv').config()
// Connect to db
require('./services/db')

const express = require('express')
const app = express()
const cors = require('cors')

const logger = require('./middlewares/logger')
const handleErrors = require('./middlewares/handleErrors')
const notFound = require('./middlewares/notFound')
const loginRouter = require('./controllers/login')
const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')

// Middlewares
app.use(express.json())
app.use(logger)
app.use(cors())

// Serve images in http://localhost:3001/images/logo.png
app.use('/images', express.static('images'))

// Routes
app.use('/api/login', loginRouter)
app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)

// Middleware to manage 404
app.use(notFound)

// Middleware to manage errors
app.use(handleErrors)

const PORT = process.env.PORT

const server = app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})

module.exports = { app, server }
