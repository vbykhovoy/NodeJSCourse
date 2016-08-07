// config/passport.js

var LocalStrategy = require('passport-local').Strategy;
var userRepository = require('../repositories/userRepository');
var winston = require('winston');


module.exports = function(passport) {

    // used to serialize the user
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        userRepository.getUser(id)
            .then(function(user){
                done(null, user);
            })
            .catch(function(err){
                done(err, null);
            });
    });
    
    passport.use('local-register', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {
            // find a user whose email is the same as the forms email
            // I am checking to see if the user trying to login already exists
            userRepository.getUserByEmail(email)
                .catch(function(err){
                    winston.log('error', err.message)
                    return done(err);
                })
                .then(function(user){
                    if (user) { // user already exists
                        return done(null, false);
                    } else {
                        // if there is no user with that email
                        // create the user
                        userRepository.createUser(req.body.name, email, password)
                            .then(function(user){
                                return done(null, user);
                            })
                            .catch(function(err){
                                winston.log('error', err.message);
                                return done(err);
                            });
                    }
                });
        }));


    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) { // callback with email and password from our form
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            userRepository.getUserByEmail(email)
                .catch(function(err){
                    winston.log('error', err.message);
                    return done(err);
                })
                .then(function(user){
                    if (!user) // if user not found
                        return done(null, false, req.flash('message', 'No user found.'));

                    // if the user is found but the password is wrong
                    if (!user.validPassword(password))
                        return done(null, false, req.flash('message', 'Wrong password.'));

                    // if user checked remember me box
                    if (req.body.remember) {
                        req.session.cookie.maxAge = 24 * 1000 * 60 * 60;
                    }
                    // all is well, return successful user
                    return done(null, user);
                });
        }));

};
