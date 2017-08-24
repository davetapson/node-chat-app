const path = require('path');       // concatenates path
const http = require('http');       // native http server
const express = require('express'); // express - web framework
const socketIO = require('socket.io')                   // socket.io

const { generateMessage, generateLocationMessage } = require('./utils/message')
const { isRealString } = require('./utils/validation.js');
const { Users } = require('./utils/users');

const publicPath = path.join(__dirname, '../public');   // get path for html files
const port = process.env.PORT || 3000;                  // for Heroku - use Heroku environment port value or 3000
const app = express();
var server = http.createServer(app);                    // express uses http server, so can just pass in app
var io = socketIO(server);                              // set up socket
var users = new Users();

app.use(express.static(publicPath));                    // use public 

io.on('connection', (socket) => { // regiseter event listener for new connections
  console.log('New user connected');

  // join listener
  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and Room name are required.');
    }

    socket.join(params.room);
    // socket.leave(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room); // add user to list

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    // io.emit - send to everyone
    // socket.broadcast - send to everyone except sender
    // socket.emit - send only to sender
    // io.to('room name').emit - send to all in room
    // socket.broadcast.to('room name').emit - send to all in room except sender

    // greet new user
    socket.emit('newMessage', generateMessage(params.room, `Welcome ${params.name}`));

    // tell all room users that new user joint chat app
    socket.broadcast.to(params.room).emit('newMessage', generateMessage("ChatApp", `${params.name} has joined.`));

    callback();
  });

  socket.on('createMessage', (newMessage, callback) => {
    var user = users.getUser(socket.id);

    if (user && isRealString(newMessage.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, newMessage.text));
    }

    callback(); //sends event to client
  })

  socket.on('createLocationMessage', (coords) => {
    var user = users.getUser(socket.id);
    
    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  })

  socket.on('disconnect', () => {             // register listener for disconnections
    var user = users.removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('ChatApp', `${user.name} has left.`));
    }
    console.log('Client disconnected');
  });
})

// start up express listener
server.listen(port, () => {
  console.log(`App listening on port: ${port}`);
});
