//MONGODB CONNECTION: mongodb+srv://mserr113:<password>@cluster0.q6mbsdx.mongodb.net/?retryWrites=true&w=majority

const express = require('express');
const mongoose = require('mongoose');

const Sauce = require('./models/sauce');
// const path = require('path');

// const userRoutes = require('./routes/user');

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

app.post('api/sauces', (req, res, next) => {
    const sauce = new Sauce({
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        heat: req.body.heat,
        likes: req.body.likes,
        dislikes: req.body.dislikes,
        imageUrl: req.body.imageUrl,
        mainPepper: req.body.mainPepper,
        usersLiked: req.body.usersLiked,
        usersDisliked: req.body.usersDisliked,
        userId: req.body.userId,
    });
    sauce.save().then(
        () => {
            res.status(201).json({
                message: 'Sauce saved successfully!'
            })
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    )
});

app.get('/api/sauces/:id', (req, res, next) => {
    Sauce.findOne({
      _id: req.params.id
    }).then(
      (sauce) => {
        res.status(200).json(sauce);
      }
    ).catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );
  });

app.put('/api/sauces/:id', (req, res, next) => {
    const sauce = new Sauce({
      _id: req.params.id,
      title: req.body.title,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      price: req.body.price,
      userId: req.body.userId
    });
    Thing.updateOne({_id: req.params.id}, thing).then(
      () => {
        res.status(201).json({
          message: 'Thing updated successfully!'
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  });

app.get('/api/sauces', (req, res, next) => {
    Sauce.find().then(
        (sauces) => {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    )
});

// app.post('/api/auth/signup', (req, res, next) => {
//     console.log(req.body);
//     res.status(201).json({
//         message: 'saved successfully'
//     });
// });
  
// app.use('/api/auth/signup', (req, res, next) => {
//     const newUser = [
//         {
//             email: 'ehoo',
//             password: 'ego',
//         }
//     ];
//     res.status(200).json('sign up was successful!');
// });


// app.use(express.urlencoded({extended: true}));
// app.use(express.json());

// app.use('/api', userRoutes);

module.exports = app;
