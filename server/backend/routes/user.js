/**
 * Copyright (c) 2025 Chaitanya Babar
 * Licensed under the MIT License. See LICENSE file in the project root for full license information.
 */

const express = require('express');
const router = express.Router();


// Modals
const Registered = require('../models/registered');
const User = require('../models/user');
const Book = require('./../models/book');
const Buyer =  require('../models/buyer');

// Middle Ware
const mongoose = require('mongoose');
const validateRequest = require('../middle-ware/check-auth');

const checkForPermissions = require('../middle-ware/check-authorization');



// Single User
router.get('/id',validateRequest,checkForPermissions, (req, res, next) => {
    var UserId = req.decodedToken.id;
    if(UserId){
        User.findById(req.decodedToken.id)
        .exec()
        .then(user => {
            if(user){
                var registeredUserId = user._id;
                console.log('registeredUserId is' + registeredUserId);
                Registered.findById(registeredUserId)
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


            }
            else{
                return res.status(404).json({
                    message: "User not registered with us !!!"
                })
            }
        })
        .catch(err => {
            return res.status(500).json({
                message: err
            })
        });
    }
    else{
        return res.status(404).json({
            message: "Please Enter Valid User id"
        });
    }
});
router.patch('/id',validateRequest, checkForPermissions,(req, res, next) => {
    var UserId = req.decodedToken._id;
    if(UserId){
        User.findById(req.decodedToken.id)
        .exec()
        .then(user => {
            if(user){
                var registeredUserId = user._id;
                console.log('registeredUserId is' + registeredUserId);
                const updateOps = {};
                // TODO: Remove this unwanted code for patching new request.
                updateOps = req.body;
                Registered.findOneAndUpdate({ _id: registeredUserId }, { $set: updateOps },{ "new": true,  rawResult: false})
                    .exec()
                    .then(docs => {
                        if (docs) {
                            User.findOneAndUpdate({ email: req.decodedToken.email }, { $set: updateOps })
                                .exec()
                                .then(userDocs => {
                                    if (userDocs) {
                                        res.status(200).json({
                                            message: 'User Details Successfully Updated !!!',
                                            updatedRegisteredUser: docs,
                                            request: {
                                                type: 'GET',
                                                url: 'http://localhost:3001/users/v1/id'
                                            }
                                        })
                                    }else{
                                        return res.status(200).json({
                                            infoMessage: `No user record for user : ${UserId} found`,
                                            message: userDocs ? userDocs : 'Update unsuccessful'
                                        });
                                    }
                                })
                                .catch(err => {
                                    return res.status(500).json({
                                        message: err
                                    })
                                })
                        }else{
                            return res.status(200).json({
                                infoMessage: `No registered user record for user : ${registeredUserId} found`,
                                message: docs ? docs : 'Update unsuccessful'
                            });
                        }
                    })
                    .catch((err) => {
                        return res.status(500).json({
                            message: err
                        })
                    });

            }
            else{
                return res.status(404).json({
                    message: "User not registered with us !!!"
                })
            }
        })
        .catch(err => {
            return res.status(500).json({
                message: err
            })
        });
       
    }
    else{
        return res.status(404).json({
            message: "Please Enter Valid User id"
        });
    }
});
router.delete('/id',validateRequest,checkForPermissions, (req, res, next) => {
    var UserId = req.decodedToken._id;
    if(UserId){
        User.findById(req.decodedToken.id)
        .exec()
        .then(user => {
            if(user){
                var registeredUserId = user._id;
                console.log('registeredUserId is' + registeredUserId);

                Registered.remove({ _id: registeredUserId })
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
                                            type: 'GET',
                                            url: 'http://localhost:3001/users/id'
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
            }
            else{
                return res.status(404).json({
                    message: "User not registered with us !!!"
                })
            }
        })
        .catch(err => {
            return res.status(500).json({
                message: err
            })
        });
    }
    else{
        return res.status(404).json({
            message: "Please Enter Valid User id"
        });
    }
});

router.get('/buyers/list', validateRequest, checkForPermissions, (req, res, next) => {
    // Buyers Model :- get bookId of every uploaded book by user in book model
                    // and search the bookID in the buyer model under bookInterested book
                    // return populated(buyer) list
    var userEmailID = req.decodedToken.email;
    if(userEmailID){
        Registered.find({email: userEmailID})
        .select('firstName _id email userRole')
        .exec()
        .then(records =>{
        if(records && records.length > 0 ){
          Book.find({addedBy: records[0]._id})
            .select('name _id price addedBy imagePath author subject bookCondition publication standard category')
            .populate('addedBy')
            .exec()
            .then(docs => {
                if (docs && docs.length > 0) {
                     var booksAddedByUser = docs.map((item) => { return item._id});  
                     booksAddedByUser = JSON.parse(JSON.stringify(booksAddedByUser));
                     Buyer.find({ bookInterested: { $in: booksAddedByUser }})
                    .select('_id quotedPrice bought initiateSell soldComplete buyer bookInterested')
                    .populate('buyer bookInterested')
                    .exec()
                    .then(docs => {
                        if (docs && docs.length > 0) {
                            console.log("Interested buyers list");
                            const response = {
                                count: docs.length,
                                books: docs.map((doc) => {
                                    return {
                                        _id: doc._id,
                                        quotedPrice: doc.quotedPrice,
                                        bought:doc.bought,
                                        initiateSell:doc.initiateSell,
                                        soldComplete:doc.soldComplete,
                                        price: doc.price,
                                        buyer: doc.buyer,
                                        bookInterested: doc.bookInterested,
                                    }
                                })
                            }
                            return res.status(200).json(response)
                        } 
                        else{
                            return res.status(200).json({
                                message: "No buyers found for your uploads."
                            });
                        }
                    })
                    .catch(err => {
                        return res
                            .status(500)
                            .json({
                                error: err.message
                            })
                    });
                } 
                else {
                    return res.status(200).json({
                        message: `No Book records for user ${userEmailID} found.`
                    });
                }
            })
            .catch(err => {
                return res
                    .status(500)
                    .json({
                        error: err.message
                    })
            });
        }
        else{
            return res.status(404).json({
            message: "User is not registered with us !!!"
            });
        }
        })
        .catch(err => {
            return res.status(500).json({error: err.message});
        });
    }
    else{
        return res.status(404).json({
        message: "Please Enter Valid User id"
        });
    }
});


// ADMIN user api's

// Multiple user list
router.get('/list', validateRequest,checkForPermissions,(req, res, next) => {
    Registered.find()
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
                            email: doc.email,
                            userRole: doc.userRole,
                            body: {
                                url: 'http://localhost:3001/users/v1/user/' + doc._id,
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
router.get('/user/:userId',validateRequest,checkForPermissions, (req, res, next) => {
    var registeredUserId = req.params.userId;
    if(registeredUserId){
        console.log('registeredUserId is' + registeredUserId);
        Registered.findById(registeredUserId)
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
    }else{
        return res.status(404).json({
            message: "Please Enter Valid User id"
          });
    }
});
router.patch('/user/:userId',validateRequest, checkForPermissions,(req, res, next) => {
    var registeredUserId = req.params.userId;
    if(registeredUserId){
        const updateOps = {};
        // TODO: Remove this unwanted code for patching new request.
        updateOps = req.body;
        Registered.findOneAndUpdate({ _id: registeredUserId }, { $set: updateOps },{ "new": true,  rawResult: false})
            .exec()
            .then(docs => {
                if (docs) {
                    User.findOneAndUpdate({ email: req.decodedToken.email }, { $set: updateOps })
                        .exec()
                        .then(userDocs => {
                            if (userDocs) {
                                res.status(200).json({
                                    message: 'User Details Successfully Updated !!!',
                                    updatedRegisteredUser: docs,
                                    request: {
                                        type: 'GET',
                                        url: 'http://localhost:3001/users/v1/user/' + registeredUserId
                                    }
                                })
                            }else{
                                return res.status(200).json({
                                    infoMessage: `No user record for user : ${registeredUserId} found`,
                                    message: userDocs ? userDocs : 'Update unsuccessful'
                                });
                            }
                        })
                        .catch(err => {
                            return res.status(500).json({
                                message: err
                            })
                        })
                }else{
                    return res.status(200).json({
                        infoMessage: `No registered user record for user : ${registeredUserId} found`,
                        message: docs ? docs : 'Update unsuccessful'
                    });
                }
            })
            .catch((err) => {
                return res.status(500).json({
                    message: err
                })
            });
    }else{
        return res.status(404).json({
            message: "Please Enter Valid User id"
        });
    }
});
router.delete('/user/:userId',validateRequest,checkForPermissions, (req, res, next) => {
    var registeredUserId = req.params.userId;
    if(registeredUserId){
        Registered.remove({ _id: registeredUserId })
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
                                    type: 'DELETE',
                                    url: 'http://localhost:3001/users/v1/user/'+ registeredUserId
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
    }else{
        return res.status(404).json({
            message: "Please Enter Valid User id"
        });
    }
});
// TODO :- Get the buyers list for books uploaded by specific user i.e. user with provided userID.
router.get('/user/:userId/buyers/list', validateRequest, checkForPermissions, (req, res, next) => {
    // Buyers Model :- get bookId of every uploaded book by user in book model
                    // and search the bookID in the buyer model under bookInterested book
                    // return populated(buyer) list
    var userEmailID = req.decodedToken.email;
    if(userEmailID){
        Registered.find({email: userEmailID})
        .select('firstName _id email userRole')
        .exec()
        .then(records =>{
        if(records && records.length > 0 ){
          Book.find({addedBy: records[0]._id})
            .select('name _id price addedBy imagePath author subject bookCondition publication standard category')
            .populate('addedBy')
            .exec()
            .then(docs => {
                if (docs && docs.length > 0) {
                     var booksAddedByUser = docs.map((item) => { return item._id});  
                     booksAddedByUser = JSON.parse(JSON.stringify(booksAddedByUser));
                     Buyer.find({ bookInterested: { $in: booksAddedByUser }})
                    .select('_id quotedPrice bought initiateSell soldComplete buyer bookInterested')
                    .populate('buyer bookInterested')
                    .exec()
                    .then(docs => {
                        if (docs && docs.length > 0) {
                            console.log("Interested buyers list");
                            const response = {
                                count: docs.length,
                                books: docs.map((doc) => {
                                    return {
                                        _id: doc._id,
                                        quotedPrice: doc.quotedPrice,
                                        bought:doc.bought,
                                        initiateSell:doc.initiateSell,
                                        soldComplete:doc.soldComplete,
                                        price: doc.price,
                                        buyer: doc.buyer,
                                        bookInterested: doc.bookInterested,
                                    }
                                })
                            }
                            return res.status(200).json(response)
                        } 
                        else{
                            return res.status(200).json({
                                message: "No buyers found for your uploads."
                            });
                        }
                    })
                    .catch(err => {
                        return res
                            .status(500)
                            .json({
                                error: err.message
                            })
                    });
                } 
                else {
                    return res.status(200).json({
                        message: `No Book records for user ${userEmailID} found.`
                    });
                }
            })
            .catch(err => {
                return res
                    .status(500)
                    .json({
                        error: err.message
                    })
            });
        }
        else{
            return res.status(404).json({
            message: "User is not registered with us !!!"
            });
        }
        })
        .catch(err => {
            return res.status(500).json({error: err.message});
        });
    }
    else{
        return res.status(404).json({
        message: "Please Enter Valid User id"
        });
    }
});




// TODO :- Not sure to keep it or not.
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
