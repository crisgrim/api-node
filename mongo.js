const mongoose = require('mongoose')
// const Note = require('./models/Note')

const connectionString = process.env.MONGOD_DB_URI

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then(() => {
        console.log('db connected')
    })
    .catch(error => {
        console.log(error)
    })

process.on('uncaughtException', () => {
    mongoose.connection.disconnect()
})

// // Command to find elements
// Note.find({})
//     .then((result) => {
//         console.log(result)
//         mongoose.connection.close()
//     })
//     .catch(error => {
//         console.log(error)
//     })

// const note = new Note({
//     content: 'Mongo DB',
//     date: new Date(),
//     important: true
// })

// // Command to create an element
// note.save()
//     .then((result) => {
//         console.log(result)
//         mongoose.connection.close()
//     })
//     .catch(err => {
//         console.log(err)
//     })