'use strict'

var messageRepository = require('../repositories/messageRepository');
var winston = require('winston');

module.exports = function(io) {
    io.on('connection', function(socket){
        socket.on('message', function (data) {
            var message = processMessage(data);
            io.emit('message', message);
        });

        socket.on('image', function (data) {
            var message = processMessage(data);
            io.emit('message', message);
        });

        socket.on('update-rooms', function (data) {
            io.emit('update-rooms');
        });
    });
};

function processMessage(data){
    messageRepository.createMessage(data.userId, data.roomId, data.message, data.image)
        .then(function (message) {
            var user = message.user.toObject();
            delete user.email; // delete email info from view model
            delete user.password; // delete password info from view model
            message.user = user;

            return message;
        })
        .catch(function (err) {
            winston.log('error', err.message)
        });
}

