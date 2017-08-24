const path = require('path'); // concatenates path
const http = require('http');

// express - web framework
const express = require('express');
const app = express();

// socket.io
const socketIO = require('socket.io')
var server = http.createServer(app); // express uses http server, so can just pass in app
var io = socketIO(server);           // set up socket

// get path for html files
const publicPath = path.join(__dirname, '../public');

// for Heroku - use Heroku environment port value or 3000
const port = process.env.PORT || 3000;

// use public 
app.use(express.static(publicPath));

const { generateMessage, generateLocationMessage } = require('./utils/message')
const { isRealString } = require('./utils/validation.js');


io.on('connection', (socket) => { // regiseter event listener for new connections
  console.log('New user connected');



  // join listener
  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      callback('Name and Room name are required.');
    }

    socket.join(params.room);
    // socket.leave(params.room);

    // io.emit - send to everyone
    // socket.broadcast - send to everyone except sender
    // socket.emit - send only to sender
    // io.to('room name').emit - send to all in room
    // socket.broadcast.to('room name').emit - send to all in room except sender

    // greet new user
    socket.emit('newMessage', generateMessage("ChatApp", `Welcome to the Chat App ${params.name}`));

    // tell all room users that new user joint chat app
    socket.broadcast.to(params.room).emit('newMessage', generateMessage("ChatApp", `${params.name} has joined.`));

    callback();
  });

  socket.on('createMessage', (newMessage, callback) => {
    console.log('newMessage', newMessage)
    // emit event to ALL connections
    io.emit('newMessage', generateMessage(newMessage.from, newMessage.text));
    callback(); //sends event to client
  })

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  })

  socket.on('disconnect', () => {             // register listener for disconnections
    console.log('Client disconnected');
  })
})
// routes
// / 
// app.get('/', (req, res) => {
//   res.send('Hello World');
// });

// start up express listener
server.listen(port, () => {
  console.log(`App listening on port: ${port}`);
});
