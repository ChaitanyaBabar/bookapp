const mongoose = require('mongoose');

const registeredSchema = mongoose.Schema({
    _id:  mongoose.Schema.Types.ObjectId,
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
    }
});

module.exports = mongoose.model("Registered", registeredSchema);