/**
 * Copyright (c) 2025 Chaitanya Babar (cbabar)
 * Licensed under the MIT License. See LICENSE file in the project root for full license information.
 */



/**
 * Copyright (c) 2025 Chaitanya Babar
 * Licensed under the MIT License. See LICENSE file in the project root for full license information.
 */

const mongoose = require('mongoose');

const buyerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    quotedPrice: {
        type: Number,
        require: true       
    },
    bought: {
        type: Boolean,
        require: true
    },
    initiateSell: {
        type: Boolean,
        require: true
    },
    soldComplete:{
        type: Boolean,
        require: true
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Registered',
        require: true
    },
    bookInterested: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        require: true
    }
});

module.exports = mongoose.model("Buyer", buyerSchema);