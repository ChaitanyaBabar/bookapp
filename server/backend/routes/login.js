/**
 * Copyright (c) 2025 Chaitanya Babar (cbabar)
 * Licensed under the MIT License. See LICENSE file in the project root for full license information.
 */



/**
 * Copyright (c) 2025 Chaitanya Babar
 * Licensed under the MIT License. See LICENSE file in the project root for full license information.
 */

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
                    message: "Email already exists !!!"
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
                            firstName: req.body.firstName,
                            password: hash,
                            userRole: req.body.userRole || 'user'
                        });
                        const registerdUser = new Registered({
                            _id: new mongoose.Types.ObjectId(),
                            firstName: req.body.firstName,
                            email: req.body.email,
                            userRole: req.body.userRole || 'user'
                        })
                        user.save()
                            .then(doc => {
                                console.log(doc);
                                console.log("User Saved !!!");


                                const acl = require('../authorization').getAcl();
                                // ACL Adding the Roles to User when created.
                                acl.addUserRoles(doc._id.toString(), doc.userRole, function(err){
                                  if (err) {
                                    console.log(err);
                                    return  res.status(500).json({error: err});
                                  }
                                   console.log('Added', user.role, 'role to user', user.firstName, 'with id', user._id);
                                });


                                registerdUser.save()
                                .then(regUser => {
                                    console.log("User Registered Successfully !!!");
                                    return res.status(200).json({
                                        message: "User created successfully $$$"
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

            // User is not registered
            if (user && user.length < 1) { // User is not registered
                // If password does not match in all cases
                return res.status(401).json({
                    message: 'Invalid Email Id or Password.'
                })
            } else { // User is Registered
                bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                    // If Password does not match
                    if (err) {
                        return res.status(401).json({
                            message: 'Invalid Email Id or Password.'
                        })
                    }
                    // If Password Match
                    if (result) {
                        const token = jwt.sign({ id: user[0]._id, email: user[0].email, userRole: user[0].userRole }, jwtsecret, { expiresIn: '2 days' });

                        return Registered.find({ email: req.body.email })
                            .exec()
                            .then(regUser => {
                                let user = regUser && regUser[0] ? regUser[0] : '';
                                user = {
                                    _id: user._id,
                                    firstName: user.firstName,
                                    email: user.email,
                                    userRole: user.userRole
                                }
                                return res.status(200).json({
                                    message: 'Login Successfull',
                                    token: token,
                                    user: user
                                })
                            })



                    }
                    // If password does not match in all cases
                    return res.status(401).json({
                        message: 'Invalid Email Id or Password.'
                    })
                })
            }

        })
        .catch(err => {
            return res.status(401).json({
                message: 'Invalid Email Id or Password.',
                error: err
            })
        })

});

module.exports = router;
