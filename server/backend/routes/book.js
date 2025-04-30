









/**
 * Copyright (c) 2025 Chaitanya Babar (cbabar)
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
const multer = require('multer');

/*
  Commenting out node acl for roles base authorization.
*/
const checkForPermissions = require('../middle-ware/check-authorization');
const fileFilter = (req, file, cb) => {
    if (true) {
        cb(null, true);
    } else {
        cb(null, false)
    }
}


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }

});

const uploads = multer({
    storage: storage,
    limits: {
        fieldSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});


router.get('/dummy/:Did', validateRequest, checkForPermissions, (req, res, next) => {
  return res.status(200).json({
    message: 'Url Accessed',
  });
});




/*
 * Common user Rest End Points.
 * All the operations are done depending upon the logged in user id.
 *
*/
router.post('/single', validateRequest, checkForPermissions, uploads.single("userImage"), (req, res, next) => {
  // If Token Present
  if (req.decodedToken.id) {
      User.findById(req.decodedToken.id)
          .exec()
          .then(user => {
              if (user) {
                  return Registered.find({ email: req.decodedToken.email })
                      .exec()
                      .then(regUser => {
                          let bookCreated = new Book({
                              _id: new mongoose.Types.ObjectId(),
                              name: req.body.name,
                              price: req.body.price,
                              addedBy: regUser[0]._id,
                              imagePath: 'http://localhost:3001/' + req.file.path.replace('\\', '/'),
                              author: req.body.author ? req.body.author : '',
                              subject: req.body.subject ? req.body.subject : '',
                              bookCondition: req.body.bookCondition ? req.body.bookCondition : '',
                              publication: req.body.publication ? req.body.publication : '',
                              standard: req.body.standard ? req.body.standard : '',
                              category: req.body.category ? req.body.category : ''
                          });
                          return bookCreated;
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
          .then(bookCreated => {
              bookCreated.save()
                  .then((result) => {
                      return res.status(201).json({
                          message: 'Created Single Book',
                          data: bookCreated,
                          body: {
                              url: 'http://localhost:3001/books/v1/' + bookCreated._id,
                              method: 'GET'
                          }
                      });
                  })
          })
          .catch(err => {
              return res.status(500).json({
                  message: err
              })
          });
  }else{
      return res.status(404).json({
          message: "Please Login to Add the User"
      })
  }
});
router.get('/book/list',validateRequest , checkForPermissions, (req, res, next) => {
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
                console.log("Get Request is Made");
                const response = {
                    count: docs.length,
                    books: docs.map((doc) => {
                        return {
                            _id: doc._id,
                            name: doc.name,
                            price: doc.price,
                            imagePath: doc.imagePath,
                            addedBy: doc.addedBy,
                            author: doc.author,
                            subject: doc.subject,
                            bookCondition: doc.bookCondition,
                            publication: doc.publication,
                            standard: doc.standard,
                            category: doc.category,
                            body: {
                                url: 'http://localhost:3001/books/v1/' + doc._id,
                                method: 'GET'
                            }
                        }
                    })
                }
                return res.status(200).json(response)
            } else {
                return res.status(200).json({
                    message: `No books uploaded by user ${userEmailID}`
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
          message: "User is not Registered..."
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


  }else{
    return res.status(404).json({
      message: "Please Enter Valid User id"
    });
  }

});
router.get('/book/all/list',validateRequest , checkForPermissions, (req, res, next) => {
    var userEmailID = req.decodedToken.email;
    if(userEmailID){

        Registered.find({email: userEmailID})
            .select('firstName _id email userRole')
            .exec()
            .then(records =>{
                if(records && records.length > 0 ){

                    Book.find()
                        .select('name _id price addedBy imagePath author subject bookCondition publication standard category')
                        .populate('addedBy')
                        .exec()
                        .then(docs => {
                            if (docs && docs.length > 0) {
                                console.log("Get Request is Made");
                                const response = {
                                    count: docs.length,
                                    books: docs.map((doc) => {
                                        return {
                                            _id: doc._id,
                                            name: doc.name,
                                            price: doc.price,
                                            imagePath: doc.imagePath,
                                            addedBy: doc.addedBy,
                                            author: doc.author,
                                            subject: doc.subject,
                                            bookCondition: doc.bookCondition,
                                            publication: doc.publication,
                                            standard: doc.standard,
                                            category: doc.category,
                                            body: {
                                                url: 'http://localhost:3001/books/v1/' + doc._id,
                                                method: 'GET'
                                            }
                                        }
                                    })
                                }
                                return res.status(200).json(response)
                            } else {
                                return res.status(200).json({
                                    message: "No records Found"
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
                        message: "User is not Registered..."
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
    }else{
        return res.status(404).json({
            message: "Please Enter Valid User id"
        });
    }

});



router.get('/book/:bookId', validateRequest, checkForPermissions, (req, res, next) => {
    var userEmailID = req.decodedToken.email;
    if(userEmailID){
      var bookId = req.params.bookId;
      Registered.find({email: userEmailID})
      .select('firstName _id email userRole')
      .exec()
      .then(records =>{
        if(records && records.length > 0 ){

          Book.find({addedBy: records[0]._id, _id: bookId})
          .select('name _id price addedBy imagePath author subject bookCondition publication standard category')
          .populate('addedBy')
          .exec()
          .then(docs => {
              if (docs && docs.length > 0) {
                  console.log("Get Request is Made");
                  const response = {
                      count: docs.length,
                      books: docs.map((doc) => {
                          return {
                              _id: doc._id,
                              name: doc.name,
                              price: doc.price,
                              imagePath: doc.imagePath,
                              addedBy: doc.addedBy,
                              author: doc.author,
                              subject: doc.subject,
                              bookCondition: doc.bookCondition,
                              publication: doc.publication,
                              standard: doc.standard,
                              category: doc.category,
                              body: {
                                  url: 'http://localhost:3001/books/v1/' + doc._id,
                                  method: 'GET'
                              }
                          }
                      })
                  }
                  return res.status(200).json(response)
              } else {
                  return res.status(200).json({
                      message: `No Book record for given book id: ${bookId} found`,
                      info: docs
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

    }else{
      return res.status(404).json({
        message: "User is not Registered..."
      });
    }

});
router.patch('/book/:bookId', validateRequest, checkForPermissions, uploads.single("userImage"),  (req, res, next) => {
  var userEmailID = req.decodedToken.email;
  if(userEmailID){
    var bookId = req.params.bookId;
    Registered.find({email: userEmailID})
    .select('firstName _id email userRole')
    .exec()
    .then(records =>{
            if(records && records.length > 0 ){
            var updateOps = {};
            // TODO: Remove this unwanted code for patching new request.
            /*
            for (const ops of req.body) {
                if (ops.propName !== '_id') {
                    updateOps[ops.propName] = ops.value;
                }
            }
            */
            updateOps = req.body;

            if(req.file && req.file.path){
                updateOps.imagePath = 'http://localhost:3001/' + req.file.path.replace('\\', '/');
            }

            Book.findOneAndUpdate({addedBy: records[0]._id, _id: bookId}, { $set: updateOps }, { "new": true,  rawResult: false})
            .select('name _id price addedBy imagePath author subject bookCondition publication standard category')
            .populate('addedBy')
            .exec()
            .then(docs => {
                if (docs) {
                        //console.log("Patching docs" + docs);
                        res.status(200).json({
                            message: 'Book Updated Successfully !!!',
                            updatedBook: docs,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3001/books/v1/book/' + bookId
                            }
                        })
                }else {
                    return res.status(200).json({
                        infoMessage: `No Book record for given book id: ${bookId} found`,
                        message: docs ? docs : 'Update unsuccessful'
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
  }else{
    return res.status(404).json({
      message: "User is not Registered..."
    });
  }
});
router.delete('/book/:bookId', validateRequest,checkForPermissions, (req, res, next) => {
  var userEmailID = req.decodedToken.email;
  if(userEmailID){

    var bookId = req.params.bookId;
    Registered.find({email: userEmailID})
    .select('firstName _id email userRole')
    .exec()
    .then(records =>{
      if(records && records.length > 0 ){
        Book.find({addedBy: records[0]._id, _id: bookId})
        .remove({ _id: bookId })
        .exec()
        .then(docs => {
            if(docs && docs.ok && docs.deletedCount > 0){
                console.log("Deleting docs" + docs);
                res.status(200).json({
                    message: 'Sucessfully Deleted',
                    request: {
                        type: 'POST',
                        url: 'http://localhost:3001/books/v1/book/list'
                    }
                });
            }
            else{
                return res.status(200).json({
                    message: `No Book record for given book id: ${bookId} found`,
                    info: docs
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
  }else{
    return res.status(404).json({
      message: "User is not Registered..."
    });
  }

});



router.get('/interested/list', validateRequest, checkForPermissions,(req, res, next) => {
    // Buyers Model :- search by Registered user id in Buyers Model
    // return populated(bookInterested) list
    var userEmailID = req.decodedToken.email;
    if(userEmailID){
  
      Registered.find({email: userEmailID})
      .select('firstName _id email userRole')
      .exec()
      .then(records =>{
        if(records && records.length > 0 ){ 
           Buyer.find({buyer: records[0]._id})
          .select('_id quotedPrice bought initiateSell soldComplete buyer bookInterested')
          .populate('buyer bookInterested')
          .exec()
          .then(docs => {
              if (docs && docs.length > 0) {
                  console.log("Get Request is Made");
                  const response = {
                      count: docs.length,
                      books: docs.map((doc) => {
                          return {
                              _id: doc._id,
                              quotedPrice: doc.quotedPrice,
                              buyer: doc.buyer,
                              bookInterested: doc.bookInterested,
                          }
                      })
                  }
                  return res.status(200).json(response)
              } else {
                  return res.status(200).json({
                      message: `No interested books found for user ${userEmailID}`
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
            message: "User is not Registered..."
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


/*
 * Super User Rest End Points.
 * All the operations are done depending upon the passed userID.
 *
*/
router.get('/list', validateRequest , checkForPermissions, (req, res, next) => {
  Book.find()
      .select('name _id price addedBy imagePath author subject bookCondition publication standard category')
      .populate('addedBy')
      .exec()
      .then(docs => {
          if (docs && docs.length > 0) {
              console.log("Get Request is Made");
              const response = {
                  count: docs.length,
                  books: docs.map((doc) => {
                      return {
                          _id: doc._id,
                          name: doc.name,
                          price: doc.price,
                          imagePath: doc.imagePath,
                          addedBy: doc.addedBy,
                          author: doc.author,
                          subject: doc.subject,
                          bookCondition: doc.bookCondition,
                          publication: doc.publication,
                          standard: doc.standard,
                          category: doc.category,
                          body: {
                              url: 'http://localhost:3001/books/v1/' + doc._id,
                              method: 'GET'
                          }
                      }
                  })
              }
              return res.status(200).json(response)
          } else {
              return res.status(200).json({
                  message: "No records Found"
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
router.get('/user/:userID/book/list',validateRequest ,checkForPermissions, (req, res, next) => {
  var userID = req.params.userID;
  if(userID){
    Book.find({addedBy: userID})
    .select('name _id price addedBy imagePath author subject bookCondition publication standard category')
    .populate('addedBy')
    .exec()
    .then(docs => {
        if (docs && docs.length > 0) {
            console.log("Get Request is Made");
            const response = {
                count: docs.length,
                books: docs.map((doc) => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        price: doc.price,
                        imagePath: doc.imagePath,
                        addedBy: doc.addedBy,
                        author: doc.author,
                        subject: doc.subject,
                        bookCondition: doc.bookCondition,
                        publication: doc.publication,
                        standard: doc.standard,
                        category: doc.category,
                        body: {
                            url: 'http://localhost:3001/books/v1/' + doc._id,
                            method: 'GET'
                        }
                    }
                })
            }
            return res.status(200).json(response)
        } else {
            return res.status(200).json({
                message: "No records Found"
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
  }else{
    return res.status(404).json({
      message: "Please Enter Valid User id"
    });
  }

});
router.get('/user/:userID/book/:bookID', validateRequest, checkForPermissions,(req, res, next) => {
  var userID = req.params.userID;;
  if(userID){
    var bookID = req.params.bookID;
    Book.find({addedBy: userID, _id: bookID})
    .select('name _id price imagePath addedBy author subject bookCondition publication standard category')
    .populate('addedBy')
    .exec()
    .then(docs => {
        if (docs && docs.length > 0) {
            res.status(200).json(docs)
        } else {
            res.status(404).json({
                message: 'No Book Record Found'
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
router.patch('/user/:userID/book/:bookID', validateRequest,checkForPermissions,uploads.single("userImage"), (req, res, next) => {
  var userID = req.params.userID;
  if(userID){
    const bookID = req.params.bookID;
    var updateOps = {};
     // TODO: Remove this unwanted code for patching new request.
    // for (const ops of req.body) {
    //     if (ops.propName !== '_id') {
    //         updateOps[ops.propName] = ops.value;
    //     }
    // }
    updateOps = req.body;

    if(req.file && req.file.path){
        updateOps.imagePath = 'http://localhost:3001/' + req.file.path.replace('\\', '/');
    }
    Book.findOneAndUpdate({addedBy: userID, _id: bookID}, { $set: updateOps })
        .select('name _id price addedBy imagePath author subject bookCondition publication standard category')
        .populate('addedBy')
        .exec()
        .then(docs => {
            if (docs) {
                //console.log("Patching docs" + docs);
                return res.status(200).json({
                    message: 'Book Updated Successfully !!!',
                    updatedBook: docs,
                    request: {
                        type: 'GET',
                        url: `http://localhost:3001/books/v1/user/${userID}/book/${bookID}`
                    }
                })
            }
            else{
                return res.status(200).json({
                    infoMessage: `No Book record for user ${userID} for given book id: ${bookID} found`,
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
router.delete('/user/:userID/book/:bookID', validateRequest,checkForPermissions, (req, res, next) => {
  var userID = req.params.userID;
  if(userID){
    const bookID = req.params.bookID;
    Book.find({addedBy: userID, _id: bookID})
        .remove({ _id: bookID })
        .exec()
        .then(docs => {
            if(docs && docs.ok && docs.deletedCount > 0){
                res.status(200).json({
                    message: 'Sucessfully Deleted',
                    request: {
                        type: 'POST',
                        url: 'http://localhost:3001/books/v1/list',
                    }
                });
            }else{
                return res.status(200).json({
                    message: `No Book record for user ${userID} for given book id: ${bookID} found`,
                    info: docs
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
// TODO :- Get the interested book list for specific user i.e. user with provided userID.
router.get('/book/:bookID/interested/list', validateRequest, checkForPermissions,(req, res, next) => {
    // Buyers Model :- search by Registered user id in Buyers Model
    // return populated(bookInterested) list
    var userEmailID = req.decodedToken.email;
    if(userEmailID){
  
      Registered.find({email: userEmailID})
      .select('firstName _id email userRole')
      .exec()
      .then(records =>{
        if(records && records.length > 0 ){ 
           Buyer.find({buyer: records[0]._id})
          .select('_id quotedPrice bought initiateSell soldComplete buyer bookInterested')
          .populate('buyer bookInterested')
          .exec()
          .then(docs => {
              if (docs && docs.length > 0) {
                  console.log("Get Request is Made");
                  const response = {
                      count: docs.length,
                      books: docs.map((doc) => {
                          return {
                              _id: doc._id,
                              quotedPrice: doc.quotedPrice,
                              buyer: doc.buyer,
                              bookInterested: doc.bookInterested,
                          }
                      })
                  }
                  return res.status(200).json(response)
              } else {
                  return res.status(200).json({
                      message: `No interested books found for user ${userEmailID}`
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
            message: "User is not Registered..."
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
