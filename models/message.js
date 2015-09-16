'use strict';

var mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    room: {
        type: mongoose.Schema.ObjectId,
        ref: 'Room'
    },
    content: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    createdDate: {
        type: Date,
        required: true
    }
});


module.exports = mongoose.model('Message', MessageSchema);
