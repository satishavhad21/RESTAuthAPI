const express = require('express');
const app = express();
const morngan = require('morgan');// morgan helpful to log request and use before everything.
const bodyParser = require('body-parser');// It will parse body of incoming request. json , url encoded data.
const mongoose = require('mongoose');// Package to communicate mongodb 

require('./config/database');

const userRoutes = require('./api/routes/users');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    var start = new Date();
    console.log('Inside logger');
    res.on('finish', () => {      
        console.log(`${req.method} ${req.originalUrl} ${new Date() - start} ${req.route}`);
    });
    next();
})

// CORS request will be handled before calling any routes
app.use((req, res, next) => {
    // "*" means Request from all client allowd
    res.header("Access-Control-Allow-Origin", "*");
    //
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept,Authorization" //Header types allowed
    );

    if (req.method === 'OPTIONS') {
        // Our api supporting only these methods
        res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,PATCH');
        return res.status(200).json({});
    }
    next();
});


//register user routes to app
app.use('/users', userRoutes);

//handle request to all other urls
app.use((req, res, next) => {
    const error = new Error('Resource Not Found');
    error.status = 404;
    console.log(error)
    next(error);
});

//Handler for all error in application
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;