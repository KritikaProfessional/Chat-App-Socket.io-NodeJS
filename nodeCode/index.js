// node server which will handle socket connections
const express = require("express");
const cors = require('cors');

const app = express();
var io = require("socket.io")(8000, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const users = {};

io.on('connection', socket => {

    //If any new user join, let other users connected to the server know!
    socket.on('new-user-joined', name => {

        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);

    });

    // is someone send message, broadcast it to other people
    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] })
    });

    // if someone leave the chat, let others know!
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id])
        delete users[socket.id];
    });

});