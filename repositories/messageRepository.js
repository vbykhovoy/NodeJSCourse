'use strict';

var Message = require('../models/message');
var Promise = require('bluebird');
var _ = require('lodash');

module.exports = {
    createMessage: function(userId, roomId, content, image) {
        var that = this;
        return new Promise(function(resolve, reject)  {
                var message = new Message({
                    user: userId,
                    room: roomId,
                    content: content,
                    image: image,
                    createdDate: new Date()
                });

                message.save(function (err) {
                    if (err) {
                        reject(err);
                    }

                    that.getFullMessageById(message._id).then(function(result){
                        resolve(result);
                    });
                });
            });
    },

    getFullMessageById: function (messageId) {
        return new Promise(function(resolve, reject) {
            Message.findById(messageId).populate('user').populate('room').exec(function (err, message) {
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

                resolve(_.orderBy(messages, ['createdDate'], ['asc']));
            });
        });
    }
};