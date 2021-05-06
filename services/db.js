const mongoose = require('mongoose')

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

process.on('uncaughtException', (error) => {
    console.log(error)
    mongoose.disconnect()
})
