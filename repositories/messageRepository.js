'use strict'

var Message = require('../models/message');
var Promise = require('bluebird');

module.exports = {
    createMessage: function(userId, roomId, message, image) {
        return new Promise(function(resolve, reject)  {
                var message = new Message({
                    user: userId,
                    room: roomId,
                    content: message,
                    image: image,
                    createdDate: new Date()
                });

                var id = message.save(function (err) {
                    if (err) {
                        reject(err);
                    }

                    return message._id;
                });

                Message.findById(id).populate('user').populate('room').exec(function (err, message) {
                    if (err) {
                        reject(err);
                    }

                    resolve(message);
                });
            });
    },

    getMessagesByRoomId: function(roomId){
        return new Promise(function(resolve, reject)  {
            Message.find({'room': roomId}).populate('user').populate('room').exec(function (err, messages) {
                if (err) {
                    reject(err);
                }

                resolve(messages);
            })
        });
    }
};