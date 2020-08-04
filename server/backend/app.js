const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require("cors");
const { accessibleRecordsPlugin } = require('@casl/mongoose');


// Adding the mongoose model before mongoose.model('' ,  {});
mongoose.plugin(accessibleRecordsPlugin);

const bookRoutes = require('./routes/book');
const loginRoutes = require('./routes/login');
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

mongoose.connection.on('connected', (test) => {
  //Configuration of ACL i.e. roles based authorization.
  require('./authorization').init();
});

// Using Logger
app.use(morgan('dev'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers',
//         'Origin , Content-Type , Accept , content-type , authorization, Authorization, X-Requested-With');
//     if (res.method == 'OPTIONS') {
//         res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE');
//         return res.status(200).json({});
//     }
//     next();
// });

app.use(cors());




// Routes
app.use('/books/v1', bookRoutes);
app.use('/login/v1', loginRoutes);
app.use('/users/v1', userRoutes);
app.use('/uploads', express.static("./uploads"));


// Error Handling
app.use((req, res, next) => {
    var error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status)
    return res.json({
        error: err.message
    });
})

module.exports = app;
