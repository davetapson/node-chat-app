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


io.on('connection', (socket)=>{ // regiseter event listener for new connections
  console.log('New user connected');

  socket.on('disconnect', ()=>{ // register listener for disconnections
    console.log('Client disconnected');
  })
}) 
// routes
// / 
// app.get('/', (req, res) => {
//   res.send('Hello World');
// });

// start up express listener
server.listen(port, () =>{
  console.log(`App listening on port: ${port}`);
});
