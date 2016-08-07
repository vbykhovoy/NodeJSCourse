'use strict'

var User = require('../models/user');
var Promise = require('bluebird');

module.exports = {
    getUser: function(id) {
        return new Promise(function(resolve, reject)  {
            User.findById(id, function(err, user) {
                if (err) {
                    reject(err);
                }

                resolve(user);
            })
        });
    },

    getUserByEmail: function(email){
        return new Promise(function(resolve, reject)  {
            User.findOne({'email': email}, function (err, user) {
                if (err){
                    reject(err);
                }

                resolve(user);
            });
        });
    },

    createUser: function(name, email, password){
        return new Promise(function(resolve, reject) {
            var newUser = new User();
            newUser.email = email;
            newUser.name = name;
            newUser.password = newUser.generateHash(password);

            newUser.save(function(err) {
                if (err) {
                    reject(err);
                }

                resolve(newUser);
            });
        });
    }

};