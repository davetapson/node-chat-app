var socket = io(); //initate request and keep connection open

socket.on('connect', function(){ // register event listener for new connections
  console.log('Connected to server'); 

  // event emitters
  // socket.emit('createEmail', {
  //   to: 'jen@example.com',
  //   text: 'Hey, this is Andrew'
  // })

  // socket.emit('createMessage', {
  //   from: 'dave',
  //   text: 'Hello'
  // });
});

// event listeners
socket.on('disconnect', function(){ // register event listener for disconnections
  console.log('Disconnected from server')
});

// socket.on('newEmail', function(email){ // listener for new email
//   console.log('New email', email);
// });

socket.on('newMessage', function(message){
  console.log('newMessage', message);
  var li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);
  jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function(e){
  e.preventDefault();
  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function (){

  })
});

var locationButton = jQuery('#send-location');

locationButton.on('click', function(){
  if(!navigator.geolocation){
    return alert('Geolocation not supported by your browser.');
  }

  navigator.geolocation.getCurrentPosition(function(position){
    socket.emit('createLocationMessage',{
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function(){
    alert('Unable to fetch locoation.');
  } )
})

socket.on('newLocationMessage', function(message){
var li = jQuery('<li></li>');
var a = jQuery('<a target="_blank">My current location</a>');

li.text(`${message.from}: `);
a.attr('href', message.url);

li.append(a);
jQuery('#messages').append(li);

});