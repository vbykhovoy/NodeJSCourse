'use strict';

var mongoose = require('mongoose');


var RoomSchema = new mongoose.Schema({
    roomName: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        required: true
    }
});


module.exports = mongoose.model('Room', RoomSchema);
