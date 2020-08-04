const express = require('express');
const router = express.Router();


// Modals
const Registered = require('../models/registered');
const Book = require('./../models/book');
const User = require('../models/user');
const registeredUsers = require('../models/registered');

// Middle Ware
const mongoose = require('mongoose');
const validateRequest = require('../middle-ware/check-auth');

const checkForPermissions = require('../middle-ware/check-authorization');


// Multiple user list
router.get('/list', validateRequest,(req, res, next) => {
    registeredUsers.find()
        .select('_id firstName email userRole')
        .exec()
        .then(docs => {
            if (docs && docs.length > 0) {
                console.log("Get Request for users is made");
                const response = {
                    count: docs.length,
                    books: docs.map((doc) => {
                        return {
                            _id: doc._id,
                            name: doc.firstName,
                            price: doc.email,
                            userRole: doc.userRole,
                            body: {
                                url: 'http://localhost:3001/users/v1/' + doc._id,
                                method: 'GET'
                            }
                        }
                    })
                }
                return res.status(200).json(response)
            } else {
                return res.status(200).json({
                    message: "No Users records Found"
                });
            }
        })
        .catch(err => {
            return res
                .status(500)
                .json({
                    error: err.message
                })
        })
});
// Single User
router.get('/:userId',validateRequest, (req, res, next) => {
    var registeredUserId = req.params.userId;
    console.log('userId is' + registeredUserId);
    registeredUsers.findById(registeredUserId)
        .select('_id firstName email userRole')
        .exec()
        .then(docs => {
            if (docs) {
                res.status(200).json(docs)
            } else {
                res.status(404).json({
                    message: 'No User' / s / ' Found'
                });
            }
        })
        .catch(err => {
            return res
                .status(500)
                .json({
                    error: err
                })
        })

});
router.patch('/:userId',validateRequest,(req, res, next) => {
    var registeredUserId = req.params.userId;
    const updateOps = {};
    for (const ops of req.body) {
        if (ops.propName !== '_id') {
            updateOps[ops.propName] = ops.value;
        }
    }
    registeredUsers.update({ _id: registeredUserId }, { $set: updateOps })
        .exec()
        .then(docs => {
            if (docs) {
                User.update({ email: req.decodedToken.email }, { $set: updateOps })
                    .exec()
                    .then(userDocs => {
                        if (userDocs) {
                            res.status(200).json({
                                message: 'User Details Successfully Updated !!!',
                                request: {
                                    type: 'GET',
                                    url: 'http://localhost:3001/users/v1' + registeredUserId
                                }
                            })
                        }
                    })
                    .catch(err => {
                        return res.status(500).json({
                            message: err
                        })
                    })
            }
        })
        .catch((err) => {
            return res.status(500).json({
                message: err
            })
        });


});
router.delete('/:userId',validateRequest, (req, res, next) => {
    var registeredUserId = req.params.userId;
    registeredUsers.remove({ _id: registeredUserId })
        .exec()
        .then(docs => {
            if (docs) {
                User.remove({ email: req.decodedToken.email })
                    .exec()
                    .then(userDocs => {
                        if (userDocs) {
                            return res.status(200).json({
                                message: 'Successfully Deleted User',
                                request: {
                                    type: 'POST',
                                    url: 'http://localhost:3001/users/:userId'
                                }
                            })
                        }
                    })
                    .catch(err => {
                        return res.status(500).json({
                            message: err
                        })
                    })
            }

        })
        .catch((err) => {
            return res.status(500).json({
                message: err
            })
        });
});

/*
  Not sure whether this route should be created or not
  as the its already present signup.

  If it does should it have authorization or not.
*/
router.post('/single', (req, res, next) => {
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
                        return res.status(500).json({
                            message: err
                        })
                    }
                    if (hash) {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            firstName: req.body.firstName,
                            password: hash,
                            userRole: req.body.userRole || 'normal'
                        });
                        const registerdUser = new Registered({
                            _id: new mongoose.Types.ObjectId(),
                            firstName: req.body.firstName,
                            email: req.body.email,
                            userRole: req.body.userRole || 'normal'
                        })
                        user.save()
                            .then(doc => {
                                console.log(doc);

                                registerdUser.save()
                                    .then(regUser => {
                                        console.log("User Registered Sucessfully !!!");
                                        return res.status(200).json({
                                            message: "User created sucessfully"
                                        });
                                    })
                                    .catch(err => {
                                        return res.status(500).json({
                                            message: err
                                        })
                                    })


                            })
                            .catch(err => {
                                return res.status(500).json({
                                    message: err
                                })
                            })
                    }
                });
            }
        });
});

module.exports = router;
