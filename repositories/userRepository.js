'use strict'

var User = require('../models/user');
var Q = require('q');

module.exports = {
    getUser: function(id) {
        var promise = Q(User.findById(id, function(err, user) {
            if (err) {
                throw err;
            }

            return user;
        }));

        return promise;
    },

    getUserByEmail: function(email){
        var promise = Q(User.findOne({ 'email' :  email }, function(err, user) {
            if (err) {
                throw err;
            }

            return user;
        }));

        return promise;
    },

    createUser: function(name, email, password){
        var newUser = new User();
        newUser.email = email;
        newUser.name = name;
        newUser.password = newUser.generateHash(password);

        var promise = Q(newUser.save(function(err) {
            if (err) {
                throw err;
            }

            return newUser;
        }));

        return promise;

    }

};