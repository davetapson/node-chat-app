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

const { generateMessage } = require('./utils/message')


io.on('connection', (socket) => { // regiseter event listener for new connections
  console.log('New user connected');

  // greet new user
  socket.emit('newMessage', generateMessage("Admin", "Welcome to the Chat App"));

  // tell all users that new user joint chat app
  socket.broadcast.emit('newMessage', generateMessage("Admin", "New user has joined the Chat App"));


  socket.on('createMessage', (newMessage, callback) => {
    console.log('newMessage', newMessage)
    // emit event to ALL connections
    io.emit('newMessage', generateMessage(newMessage.from, newMessage.text));
    callback('This is from the server'); //sends event to client
  })

  // send message from user to users
  //socket.broadcast.emit('newMessage', generateMessage(newMessage, newMessage.text));

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
