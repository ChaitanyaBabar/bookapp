/**
 * Copyright (c) 2025 Chaitanya Babar (cbabar)
 * Licensed under the MIT License. See LICENSE file in the project root for full license information.
 */

const mongoose = require('mongoose');


const TypesOfUsers = require('../models/roles');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        require: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    firstName: {
        type: String,
        require: true,
        default: "Registered User"
    },
    password: {
        type: String,
        require: true
    },
    userRole: {
        type: String,
        require: true,
        enum: Object.values(TypesOfUsers),
    }
})

module.exports = mongoose.model('User', userSchema);