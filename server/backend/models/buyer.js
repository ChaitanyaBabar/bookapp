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