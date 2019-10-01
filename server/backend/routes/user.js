const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


// Middle Ware
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtsecret = 'secret';

// Models
const Registered = require('../models/registered');
const User = require('../models/user');

router.post('/signup', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user && user.length > 0) {
                // User Already Exists
                res.status(500).json({
                    messsage: "Email already exists !!!"
                })
            } else {
                // User does not exits
                bcrypt.hash(req.body.password, 10, function(err, hash) {
                    if (err) {
                        res
                            .status(500)
                            .json({
                                error: err
                            })
                    }
                    if (hash) {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        const registerdUser = new Registered({
                            _id: new mongoose.Types.ObjectId(),
                            firstName: req.body.firstName,
                            email: req.body.email
                        })
                        user.save()
                            .then(doc => {
                                console.log(doc);

                                registerdUser.save()
                                    .then(regUser => {
                                        console.log("User Registered Sucessfully !!!");
                                        return res.status(200).json({
                                            messsage: "User created sucessfully"
                                        });
                                    })
                                    .catch(err => {
                                        return res
                                            .status(500)
                                            .json({
                                                error: err
                                            })
                                    })


                            })
                            .catch(err => {
                                return res
                                    .status(500)
                                    .json({
                                        error: err
                                    })
                            })
                    }
                });
            }
        });
});

router.post('/signin', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {

            if (user && user.length < 1) {
                res.status(401).json({
                    messsage: 'Auth Failed !!!'
                })
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                // If Password does not match
                if (err) {
                    return res.status(401).json({
                        messsage: 'Auth Failed !!!'
                    })
                }
                // If Password Match
                if (result) {
                    const token = jwt.sign({ id: user[0]._id, email: user[0].email }, jwtsecret, { expiresIn: '2h' });
                    return res.status(200).json({
                        messsage: 'Login Sucessfull',
                        token: token
                    })
                }
                // If password does not match in all cases
                return res.status(401).json({
                    messsage: 'Auth Failed !!!'
                })
            })
        })
        .catch(err => {
            return res.status(401).json({
                messsage: 'Auth Failed !!!'
            })
        })

});

module.exports = router;