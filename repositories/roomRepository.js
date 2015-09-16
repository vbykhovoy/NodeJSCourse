'use strict'

var Room = require('../models/room');
var Q = require('q');

module.exports = {
    getRoom: function(id) {
        var promise = Q(Room.findById(id, function (err, room) {
            if (err) {
                throw err;
            }

            return room;
        }));

        return promise;
    },

    getRooms: function(){
        var promise = Q(Room.find(function (err, rooms) {
            if (err) {
                throw err;
            }

            return rooms;
        }));

        return promise;
    },

    saveRoom: function(name){
        var newRoom = new Room({
            roomName: name,
            createdDate: new Date()
        });

        var promise = Q(newRoom.save(function (err) {
            if (err) {
                throw err;
            }
        }));

        return promise;
    }
};