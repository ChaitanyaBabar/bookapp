/**
 * Copyright (c) 2025 Chaitanya Babar
 * Licensed under the MIT License. See LICENSE file in the project root for full license information.
 */

const express = require('express');
const router = express.Router();


// Modals
const Registered = require('../models/registered');
const Book = require('./../models/book');
const User = require('../models/user');
const Buyer =  require('../models/buyer');

// Middle Ware
const mongoose = require('mongoose');
const validateRequest = require('../middle-ware/check-auth');

const checkForPermissions = require('../middle-ware/check-authorization');



router.post('/buy/initiate',validateRequest,checkForPermissions, (req, res, next) => {
    // If Token Present
    var bookId = req.body.bookId;
    if (req.decodedToken.id) {
        User.findById(req.decodedToken.id)
            .exec()
            .then(user => {
                if (user) {
                    return Registered.find({ email: req.decodedToken.email })
                        .exec()
                        .then(regUser => {
                            if(regUser){
                                return Book.find({ _id: bookId })
                                    .exec()
                                    .then(docs => {
                                        if(docs && docs.length > 0){
                                            let buyerCreated = new Buyer({
                                                _id: new mongoose.Types.ObjectId(),
                                                quotedPrice: req.body.quotedPrice ? req.body.quotedPrice : 0,
                                                bought: false,
                                                initiateSell: false,
                                                soldComplete: false,
                                                buyer: regUser[0]._id,
                                                bookInterested: bookId
                                            });
                                            return buyerCreated;
                                        }
                                        else{
                                            return res.status(200).json({
                                                message: `No Book record for given book id: ${bookId} found`,
                                                info: docs ? docs : 'Book buy initiate unsuccessful'
                                            });
                                        }
                                    })
                                    .catch(err => {
                                        return res.status(500).json({
                                            message: err
                                        })
                                    })
                            }
                        })
                        .catch(err => {
                            return res.status(500).json({
                                message: err
                            })
                        })
                } else {
                    return res.status(404).json({
                        message: "User not registered with us !!!"
                    })
                }
            })
            .then(buyerCreated => {
                buyerCreated.save()
                    .then((result) => {
                        return res.status(201).json({
                            message: 'Added into book into interested in buying',
                            data: result,
                        });
                    })
            })
            .catch(err => {
                return res.status(500).json({
                    message: err
                })
            });
    }
    else
    {
        return res.status(404).json({
            message: "Please login to add book in interested book list"
        })
    }
});

router.patch('/sell/initiate',validateRequest,checkForPermissions, (req, res, next) => {
    // Buyers Model :- Find by ID buyers model and patch initiateSell to true in buyers model
    var userEmailID = req.decodedToken.email;
    if(userEmailID){
      var buyerID = req.body.buyerID;
      Registered.find({email: userEmailID})
      .select('firstName _id email userRole')
      .exec()
      .then(records =>{
              if(records && records.length > 0 ){
              var updateOps = {};
              updateOps = req.body;
              
              // What ever is initiateSell passed , must be set true.
              updateOps.initiateSell = updateOps.initiateSell ? updateOps.initiateSell : true;
  
              Buyer.findOneAndUpdate({_id: buyerID}, { $set: updateOps }, { "new": true,  rawResult: false})
              .select('_id quotedPrice bought initiateSell soldComplete buyer bookInterested')
              .populate('buyer bookInterested')
              .exec()
              .then(docs => {
                  if (docs) {
                          //console.log("Patching docs" + docs);
                          res.status(200).json({
                              message: 'Book sell initiated successfully !!!',
                              data: docs
                          })
                  }else {
                      return res.status(200).json({
                          infoMessage: `No Buyer for given Buyer Id: ${buyerID} found`,
                          message: docs ? docs : 'Book sale initiation unsuccessful'
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
        message: "User not registered with us !!!"
      });
    }

});

router.patch('/sold/complete',validateRequest,checkForPermissions, (req, res, next) => {
    //  Buyers Model :- Find by ID buyers model and patch soldComplete,bought to true in buyers model
    var userEmailID = req.decodedToken.email;
    if(userEmailID){
      var buyerID = req.body.buyerID;
      Registered.find({email: userEmailID})
      .select('firstName _id email userRole')
      .exec()
      .then(records =>{
              if(records && records.length > 0 ){
              var updateOps = {};
              updateOps = req.body;
              
              // What ever is soldComplete passed , must be set true.
              updateOps.soldComplete = updateOps.soldComplete ? updateOps.soldComplete : true;
              updateOps.bought = updateOps.bought ? updateOps.bought : true;

  
              Buyer.findOneAndUpdate({_id: buyerID}, { $set: updateOps }, { "new": true,  rawResult: false})
              .select('_id quotedPrice bought initiateSell soldComplete buyer bookInterested')
              .populate('buyer bookInterested')
              .exec()
              .then(docs => {
                  if (docs) {
                          //console.log("Patching docs" + docs);
                          res.status(200).json({
                              message: 'Book sold successfully !!!',
                              data: docs
                          })
                  }else {
                      return res.status(200).json({
                          infoMessage: `No Buyer for given Buyer Id: ${buyerID} found`,
                          message: docs ? docs : 'Book sale initiation unsuccessful'
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
        message: "User not registered with us !!!"
      });
    }
});

module.exports = router;


