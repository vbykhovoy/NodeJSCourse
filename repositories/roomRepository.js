'use strict'

var Room = require('../models/room');
var Promise = require('bluebird');
var _ = require('lodash');

module.exports = {
    getRoom: function(id) {
        return new Promise(function(resolve, reject)  {
            Room.findById(id, function (err, room) {
                if (err) {
                    reject(err);
                }

                resolve(room);
            });
        });
    },

    getRooms: function(){
        return new Promise(function(resolve, reject)  {
            Room.find(function (err, rooms) {
                if (err) {
                    reject(err);
                }

                resolve(_.orderBy(rooms, ['createdDate'], ['desc']));
            });
        });
    },

    saveRoom: function(name){
        return new Promise(function(resolve, reject)  {
            var newRoom = new Room({
                roomName: name,
                createdDate: new Date()
            });

            newRoom.save(function (err) {
                if (err) {
                    reject(err);
                }

                resolve();
            });
        });
    }
};