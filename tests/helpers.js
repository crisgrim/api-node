const initialNotes = [
    {
        content: 'First test',
        date: new Date(),
        important: true
    },
    {
        content: 'Second test',
        date: new Date(),
        important: false
    }
]

const initialUsers = [
    {
        username: 'crisroot',
        name: 'Cris',
        passwordHash: 'test'
    }
]

module.exports = { initialNotes, initialUsers }