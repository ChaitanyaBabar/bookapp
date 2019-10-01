const express = require('express');
const app = express();
const mongoose = require('mongoose');


const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');
const morgan = require('morgan');
const bodyParser = require('body-parser');

// Connecting to db.
mongoose.connect('mongodb://localhost:27017/myapp', { useNewUrlParser: true })
    .then((result) => {
        console.log('Connected to MondoDB !!!');
    })
    .catch((err) => {
        console.log('Unable to connect to mongoDB');
    })


// Using Logger
app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    req.header('Access-Control-Allow-Origin', '*');
    req.header('Access-Control-Allow-Headers',
        'Origin , Content-Type , Accept , Authorization, X-Requested-With');
    if (req.method == 'OPTIONS') {
        req.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE');
        return res.status(200).json({});
    }
    next();
})



// Routes
app.use('/books/v1', bookRoutes);
app.use('/login/v1', userRoutes);
app.use('/uploads', express.static("./uploads"));


// Error Handling
app.use((req, res, next) => {
    var error = new Error('Not Found');
    res.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status = error.status || 500;
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;