// routes/routes.js

var roomRepository = require('../repositories/roomRepository');
var messageRepository = require('../repositories/messageRepository');
var winston = require('winston');

module.exports = function(app, passport) {

    // home page route, redirect to lobby page if user signed in
    app.get('/', isLoggedIn, function(req, res) {
        res.render('lobby', { title: 'Home', user: req.user });
    });

    // room page route
    app.get('/room/:id', isLoggedIn, function(req, res){
        roomRepository.getRoom(req.params.id)
            .then(function(result){
                var room = result[0];
                res.render('room', { title: room.roomName, room: room, user: req.user });
            })
            .catch(function(err){
                returnServerError(res, err);
            });
    });

    // login page route
    app.get('/login', function(req, res) {
        res.render('login', { title: 'Login' });
    });

    // user authentication action
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/login?failed=true', // redirect back to the signup page if there is an error
        failureFlash : true
    }));

    // register page route
    app.get('/register', function(req, res) {
        res.render('register', { title: 'Register New User' });
    });

    // user registration action
    app.post('/register', passport.authenticate('local-register', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/register?failed=true' // redirect back to the register page if there is an error
    }));

    // user logout action
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


    // API routes

    // get rooms api action
    app.get('/api/rooms', isApiLoggedIn, getRooms);

    // save new room api action
    app.post('/api/rooms', isApiLoggedIn, function(req, res) {
        roomRepository.saveRoom(req.body.name)
            .then(function(){
                getRooms(req, res);
            })
            .catch(function(err){
                returnServerError(res, err);
            });
    });

    // get message by room id api action
    app.get('/api/messages/:id', isApiLoggedIn, function(req, res) {
        messageRepository.getMessagesByRoomId(req.params.id)
            .then(function(messages){
                for(i=0; i<messages.length;i++){
                    var user = messages[i].user.toObject();
                    delete user.email;
                    delete user.password;
                    messages[i].user = user;
                }

                return res.send(messages);
            })
            .catch(function(err){
                returnServerError(res, err);
            });
    });
};

function getRooms(req, res){
    roomRepository.getRooms()
        .then(function(rooms){
            return res.send(rooms);
        })
        .catch(function(err){
            returnServerError(res, err);
        });
}

function returnServerError(res, err){
    res.statusCode = 500;
    winston.log('Internal error(%d): %s', res.statusCode, err.message);
    res.send({ error: 'Server error' });
}

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login');
}

function isApiLoggedIn(req, res, next) {

    if (req.isAuthenticated()) {
        return next();
    }

    res.statusCode = 401;
    res.send({ error: 'User unauthorized' });
}
