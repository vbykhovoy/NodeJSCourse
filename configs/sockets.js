'use strict'

var messageRepository = require('../repositories/messageRepository');
var winston = require('winston');

module.exports = function(io) {
    io.on('connection', function(socket){
        socket.on('message', function (data) {
            processMessage(data)
                .then(function(message){
                    io.emit('message', message);
                });
        });

        socket.on('image', function (data) {
            console.log('----sockets' + data.image);
            processMessage(data)
                .then(function(message){
                    io.emit('message', message);
                });
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

