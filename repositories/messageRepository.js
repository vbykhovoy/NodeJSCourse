'use strict'

var Message = require('../models/message');
var Q = require('q');

module.exports = {
    createMessage: function(userId, roomId, message, image) {
        var message = new Message({
            user: userId,
            room: roomId,
            content: message,
            image: image,
            createdDate: new Date()
        });

        var deferred = Q.defer();
        var promise = Q(message.save(function (err) {
            if (err) {
                throw err;
            }

            return message._id;
        }));

        promise.then(function (id) {
            Message.findById(id).populate('user').populate('room').exec(function (err, message) {
                if (err) {
                    throw err;
                }

                deferred.resolve(message);
            });
        });

        return deferred.promise;
    },

    getMessagesByRoomId: function(roomId){
        var promise = Q(Message.find({'room': roomId}).populate('user').populate('room').exec(function (err, messages) {
            if (err) {
                throw err;
            }

            return messages;
        }));

        return promise;
    }
};