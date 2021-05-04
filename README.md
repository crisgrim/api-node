# Node API

Repository to create an API with Node.js deployed on Heroku.
Use Mongo and Mongoose to persist the information in a database.

This API includes some methods:

- GET - All list
- GET - An element by id
- POST - Create an element
- PUT - Edit an element
- DELETE - An element by id

And some middlewares to control each request:

- handleErrors - Control specific errors
- logger - Log information about the request
- notFound - Return a 404 error
