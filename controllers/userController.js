const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // used to encrypt password and store in database
const jwt = require('jsonwebtoken');  // used to create secrate token and send to client

const User = require('../models/user');
// this method will check tha user credetial in database. 
// If present creates jwt token sends to user in response
exports.login = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Authentication failed'
                });
            }
            else {
                //compared the encrypted password stored in db with password provided in request
                // we encrypted password in signup method
                bcrypt.compare(req.body.password, user[0].password, (error, result) => {
                    if (error) {
                        return res.status(401).json({
                            message: 'Authentication failed',
                            error: error
                        });
                    }

                    if (result) {
                        // Create token if user present in db.
                        const token = jwt.sign(
                            {
                                email: user[0].email,
                                id: user[0]._id,
                                iat: new Date().getTime()
                            },
                            process.env.JWT_KEY,
                            //"secret - this secrete needs to be protected in vault"
                            {
                                expiresIn: "1h"  
                                // you can specify time in minutes/hours etc. after which token will be invalid
                            }
                        );
                        console.log(token);
                     
                        return res.status(200).json({
                            message: 'Authentication successful',
                            token: token,
                            usename: user[0].email
                        });
                    }
                    res.status(401).json({
                        message: 'Authentication failed',
                        error: error
                    });

                });
            }
        })
        .catch(error => {
            res.status(401).json({
                message: 'Authentication failed',
                error: error
            });
        })
};

exports.signup = (req, res, next) => {
    console.log("Inside signup");
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'email already exist'
                });
            }
            else {
                // encrypt the password before storing into the database
                bcrypt.hash(req.body.password, 10, (error, hashpw) => {
                    if (error) {
                        return res.status(500).json({
                            message: 'Error in hashing',
                            error: error
                        })
                    }
                    else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hashpw // store hased password 
                        });

                        user
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(200).json({
                                    message: 'user created'
                                })
                            })
                            .catch(error => {
                                console.log(error);
                                res.status(500).json({
                                    error: error
                                });
                            })
                    }
                });
            }
        })
        .catch(error => {
            res.status(401).json({
                message: 'Authentication failed',
                error: error
            });
        })
}

exports.delete = (req, res, next) => {
    User.remove({ _id: req.param.userId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: `Deleted User`,
                request: {
                    type: 'POST',
                    url: 'http://localhost:5000/users/signup',
                    body: {
                        email: 'String',
                        password: 'String'
                    }
                }
            });
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                message: 'Error occured while deleteing User',
                error: error
            })
        })
}

