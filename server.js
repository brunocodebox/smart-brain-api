// Will use require instead of import because bcrypt-nodejs is deprecated and uses require.
//import express from 'express';
// Update the process.env with our private configurations
require('dotenv').config();

const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

// Include the controllers
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// Run knex
const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'admin',
    database : 'smart-brain'
  }
});
  
const app = express();

// In reality we shouldn't be using hard-coded ports. Shoud use environment
// variable and access it through "process.env.PORT". And to create the PORT 
// environment variable with a specific number we have to inject it. The port 
// can be injected when the server is started like so: 
// "PORT = 3000 node server.js" or "PORT = 3050 node server.js"
// The same principle applies to other variables that need to be implemented
// like for example the database: // "DATABASE_URL = 123 node server.js".

app.listen(3000, () => {
  console.log('app is running on port 3000');
});

// req.body is undefined by default, need to use a parser middleware
app.use(express.json());

// We also need the cors middleware to accept http requests from our client
// without being blocked by Chrome.
app.use(cors());

// Create a root route access. Not really necessary but will make it to return all the users.
app.get('/', (req, res) => {
  // Just return saying that the server is alive. Don't give the list of users.
  // db('users')
  // .then(users => res.json(users))
  // .catch(err => 'unable to get users');
  res.json('Welcome to Smart-Brain!');
});

// Note that the (req, res) parameters are available to handleSignin together with its called parameters.
// Internally it is equivalent to signin.handleSignin(db, bcrypt)(req, res).
// app.post('/signin', (req, res) => signin.handleSignin(req, res, db, bcrypt));
app.post('/signin', signin.handleSignin(db, bcrypt));

// We do need to pass the database db object and the bcrypt module. This is called dependency injection.
app.post('/register', (req, res) => register.handleRegister(req, res, db, bcrypt));

// Get the profile and id through the request.params property
app.get('/profile/:id', (req, res) => profile.handleProfile(req, res, db));

// Increase the image score count
app.post('/imageUrl', (req, res) => image.handleApiCall(req, res));
app.put('/image', (req, res) => image.handleImage(req, res, db));
