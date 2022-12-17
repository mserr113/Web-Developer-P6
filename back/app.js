const express = require('express');
const path = require('path');

const userRoutes = require('./routes/user');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.post('/api/auth/signup', (req, res, next) => {
    console.log(req.body);
    res.status(201).json({
        message: 'saved successfully'
    });
});
  
// app.use('/api/auth/signup', (req, res, next) => {
//     const newUser = [
//         {
//             email: 'ehoo',
//             password: 'ego',
//         }
//     ];
//     res.status(200).json('sign up was successful!');
// });


app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/api', userRoutes);

module.exports = app;
