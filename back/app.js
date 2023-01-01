//MONGODB CONNECTION: mongodb+srv://mserr113:<password>@cluster0.q6mbsdx.mongodb.net/?retryWrites=true&w=majority

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const sauceRoutes = require('./routes/sauce');

const userRoutes = require('./routes/user');

const app = express();

mongoose.connect('mongodb+srv://mserr113:1STmonpw@cluster0.q6mbsdx.mongodb.net/?retryWrites=true&w=majority')
    .then(() => {
        console.log('Success! Connected to MongoDB Atlas');
    })
    .catch((error) => {
        console.log('Unable to connect to MongoDB Atlas');
        console.log(error);
    });

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
    });

app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;
