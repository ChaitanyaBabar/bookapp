/**
 * Copyright (c) 2025 Chaitanya Babar (cbabar)
 * Licensed under the MIT License. See LICENSE file in the project root for full license information.
 */



/**
 * Copyright (c) 2025 Chaitanya Babar
 * Licensed under the MIT License. See LICENSE file in the project root for full license information.
 */

const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    imagePath: {
        type: String,
        require: true
    },
    bookCondition: {
        type: String,
        require: true,
    },
    publication: {
        type: String,
    },
    standard: {
        type: String
    },
    category: {
        type: String
    },
    author: {
        type: String
    },
    subject: {
        type: String
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Registered',
        require: true
    },
    interestedBuyersList: [{
        quotePrice: {
            type: Number        
        },
        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Registered'
        },
        sold: {
            type: Boolean
        }
    }]
})

module.exports = mongoose.model('Book', bookSchema);
