const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const { app, server } = require('../index')
const User = require('../models/User')
const { initialUsers } = require('./helpers')

const api = supertest(app)

describe('/api/users', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const usersObjects = initialUsers.map(user => new User(user))
        const promises = usersObjects.map(user => user.save())
        await Promise.all(promises)
    })

    describe('GET', () => {
        test('return response in JSON', async () => {
            await api
                .get('/api/users')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
        })

        test('return length of the response expected', async () => {
            const response = await api.get('/api/users')
            expect(response.body).toHaveLength(initialUsers.length)
        })

        test('return response with content expected', async () => {
            const response = await api.get('/api/users')
            const contents = response.body.map(user => user.username)
            expect(contents).toContain('crisroot')
        })
  })

    describe('POST', () => {
        test('create an user', async () => {
            const usersDB = await User.find({})
            const usersAtStart = usersDB.map(user => user.toJSON())

            const newUser = {
                username: 'cristest',
                name: 'CrisTest',
                password: 'test'
            }

            await api
                .post('/api/users')
                .send(newUser)
                .expect(201)
                .expect('Content-Type', 'application/json; charset=utf-8')

            const usersDBAfter = await User.find({})
            const usersAtEnd = usersDBAfter.map(user => user.toJSON())

            expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

            const usernames = usersAtEnd.map(user => user.username)
            expect(usernames).toContain(newUser.username)
        })

        test('don\'t create an user', async () => {
            const usersDB = await User.find({})
            const usersAtStart = usersDB.map(user => user.toJSON())

            const newUser = {
                username: 'crisroot',
                name: 'CrisTest',
                password: 'test'
            }

            const result = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', 'application/json; charset=utf-8')

            expect(result.body.errors.username.message).toContain('Error, expected `username` to be unique. Value: `crisroot`')

            const usersDBAfter = await User.find({})
            const usersAtEnd = usersDBAfter.map(user => user.toJSON())

            expect(usersAtEnd).toHaveLength(usersAtStart.length)
        })
    })

    afterAll(() => {
        mongoose.connection.close()
        server.close()
    })
})
