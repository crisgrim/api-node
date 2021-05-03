const { model, Schema } = require('mongoose')

const noteSchema = new Schema({
    content: String,
    date: Date,
    important: Boolean
})

// Modify object that will be returned
noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject._v
    }
})

const Note = model('Note', noteSchema)

module.exports = Note