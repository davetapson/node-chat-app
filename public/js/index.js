var socket = io(); //initate request and keep connection open

socket.on('connect', function(){ // register event listener for new connections
  console.log('Connected to server'); 

  // event emitters
  // socket.emit('createEmail', {
  //   to: 'jen@example.com',
  //   text: 'Hey, this is Andrew'
  // })

  socket.emit('createMessage', {
    from: 'dave',
    text: 'Hello'
  });
});

// event listeners
socket.on('disconnect', function(){ // register event listener for disconnections
  console.log('Disconnected from server')
});

// socket.on('newEmail', function(email){ // listener for new email
//   console.log('New email', email);
// });

socket.on('newMessage', function(message){
  console.log('neWmessage', message);
});