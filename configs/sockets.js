'use strict'

var messageRepository = require('../repositories/messageRepository');
var winston = require('winston');
var Q = require('q');

module.exports = function(io) {
    io.on('connection', function(socket){
        socket.on('message', function (data) {
            processMessage(data)
                .then(function(message){
                    io.emit('message', message);
                });
        });

        socket.on('image', function (data) {
            console.log('----scockets' + data.image);
            processMessage(data)
                .then(function(message){
                    io.emit('message', message);
                });
        });
    });
};

function processMessage(data){
    var deferred = Q.defer();
    messageRepository.createMessage(data.userId, data.roomId, data.message, data.image)
        .then(function (message) {
            var user = message.user.toObject();
            delete user.email;
            delete user.password;
            message.user = user;
            deferred.resolve(message);
        })
        .fail(function (err) {
            winston.log('error', err.message)
        });

    return deferred.promise;
}

