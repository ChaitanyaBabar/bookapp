const mongoose = require("mongoose");

const TypesOfUsers = require("../models/roles");

const registeredSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: {
        type: String,
        require: true,
        default: "Registered User"
    },
    email: {
        type: String,
        require: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    userRole: {
        type: String,
        require: true,
        enum: Object.values(TypesOfUsers)
    },
    interestedBookList:[{
        quotedPrice:{
            type: Number
        },
        book:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book'
        }
    }]
});

module.exports = mongoose.model("Registered", registeredSchema);
