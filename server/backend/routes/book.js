const express = require('express');
const router = express.Router();


// Modals
const Registered = require('../models/registered');
const Book = require('./../models/book');
const User = require('../models/user');

// Middle Ware
const mongoose = require('mongoose');
const validateRequest = require('../middle-ware/check-auth');
const multer = require('multer');

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


// Multiple Book
router.get('/list', validateRequest, (req, res, next) => {
    Book.find()
        .select('name _id price registered imagePath')
        .populate('registered')
        .exec()
        .then(docs => {
            if (docs && docs.length > 0) {
                const response = {
                    count: docs.length,
                    books: docs.map((doc) => {
                        return {
                            id: doc._id,
                            name: doc.name,
                            price: doc.price,
                            imagePath: doc.imagePath,
                            registered: doc.registered,
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
// Single Books
router.get('/:bookId', validateRequest, (req, res, next) => {
    var bookId = req.params.bookId;
    console.log('BookId is' + bookId);
    Book.findById(bookId)
        .select('name _id price imagePath registered')
        .populate('registered')
        .exec()
        .then(docs => {
            if (docs) {
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

});
router.post('/single', validateRequest, uploads.single("userImage"), (req, res, next) => {
    console.log("File is ########## \n");
    console.log(req.file);
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
                                registered: regUser[0]._id,
                                imagePath: 'http://localhost:3001/' + req.file.path.replace('\\', '/')
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
    } else {
        return res.status(404).json({
            message: "Please Login to Add the User"
        })
    }
});
router.patch('/:bookId', validateRequest, (req, res, next) => {
    const id = req.params.bookId;
    const updateOps = {};
    for (const ops of req.body) {
        if (ops.propName !== '_id') {
            updateOps[ops.propName] = ops.value;
        }
    }
    Book.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(docs => {
            console.log("Patching docs" + docs);
            if (docs) {
                res.status(200).json({
                    message: 'Book Updated Sucessfully !!!',
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3001/books/v1' + id
                    }
                })
            }
        })
        .catch((err) => {
            return res.status(500).json({
                message: err
            })
        });


});
router.delete('/:bookId', validateRequest, (req, res, next) => {
    const id = req.params.bookId;
    Book.remove({ _id: id })
        .exec()
        .then(docs => {
            res.status(200).json({
                message: 'Sucessfully Deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3001/books/:bookId',
                    data: { 'name': 'String', 'price': 'Number' }
                }
            })
        })
        .catch((err) => {
            return res.status(500).json({
                message: err
            })
        });
});


module.exports = router;