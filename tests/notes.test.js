const mongoose = require('mongoose')
const supertest = require('supertest')
const { app, server } = require('../index')
const Note = require('../models/Note')
const { initialNotes } = require('./helpers')

const api = supertest(app)

describe('/api/notes', () => {
    beforeEach(async () => {
        await Note.deleteMany({})
    
        const notesObjects = initialNotes.map(note => new Note(note))
        const promises = notesObjects.map(note => note.save())
        await Promise.all(promises)
    })
    
    describe('GET', () => {
        test('return response in JSON', async () => {
            await api
                .get('/api/notes')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8')
        })
        
        test('return length of the response expected', async () => {
            const response = await api.get('/api/notes')
            expect(response.body).toHaveLength(initialNotes.length)
        })
        
        test('return response with content expected', async () => {
            const response = await api.get('/api/notes')
            const contents = response.body.map(note => note.content)
            expect(contents).toContain('First test')
        })
    })
    
    describe('DELETE', () => {
        test('delete a note with a valid ID', async () => {
            const response = await api.get('/api/notes')
            const ids = response.body.map(note => note.id)
        
            await api.delete(`/api/notes/${ids[0]}`)
                .expect(204)
        
            const { body } = await api.get('/api/notes')
            expect(body).toHaveLength(initialNotes.length - 1)
        })
        
        test('don\'t delete a note with an invalid ID', async () => {
            const id = '1234'
        
            await api.delete(`/api/notes/${id}`)
                .expect(500)
        
            const { body } = await api.get('/api/notes')
            expect(body).toHaveLength(initialNotes.length)
        })
    })
    
    describe('POST', () => {
        test('create a new note', async () => {
            const newNote =   {
                content: 'Second test',
                important: false
            }
        
            await api
                .post('/api/notes')
                .send(newNote)
                .expect(201)
                .expect('Content-Type', 'application/json; charset=utf-8')
        
            const response = await api.get('/api/notes')
            const contents = response.body.map(note => note.content)
        
            expect(response.body).toHaveLength(initialNotes.length + 1)
            expect(contents).toContain(newNote.content)
        })
        
        test('don\'t create a new note with invalid information', async () => {
            const newNote =   {
                important: false
            }
        
            await api
                .post('/api/notes')
                .send(newNote)
                .expect(400)
        
            const response = await api.get('/api/notes')
            const contents = response.body.map(note => note.content)
        
            expect(response.body).toHaveLength(initialNotes.length)
            expect(contents).not.toContain(newNote.content)
        })
    })
    /*
    describe('PUT', () => {
        test('update a note', async () => {
            const response = await api.get('/api/notes')
            const note = response.body[0]
        
            const noteToUpdate =   {
                content: 'First test UPDATED',
                important: false
            }
        
            await api
                .put(`/api/notes/${note.id}`, noteToUpdate)
                .expect(204)
        
            const newResponse = await api.get('/api/notes')
            const noteUpdated = newResponse.body[0]
        
            expect(noteUpdated.content).toBe(noteToUpdate.content)
            expect(noteUpdated.important).toBe(noteToUpdate.important)
        })
    })
    */
    
    afterAll(() => {
        mongoose.connection.close()
        server.close()
    })
})
