var socket = io(); //initate request and keep connection open

socket.on('connect', function () { // register event listener for new connections
  console.log('Connected to server');
});

// event listeners
socket.on('disconnect', function () { // register event listener for disconnections
  console.log('Disconnected from server')
});

socket.on('newMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('HH:mm')
  var li = jQuery('<li></li>');
  li.text(`${message.from} ${formattedTime}: ${message.text}`);
  jQuery('#messages').append(li);
});

var messageTextbox = jQuery('[name=message]');

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();
  socket.emit('createMessage', {
    from: 'User',
    text: messageTextbox.val()
  }, function () {
    messageTextbox.val('');
  })
});

var locationButton = jQuery('#send-location');

locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  locationButton.prop('disabled', true).text('Sending location...');

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.prop('disabled', false).text('Send location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    alert('Unable to fetch locoation.');
    locationButton.prop('disabled', false).text('Send location');
  })
})

socket.on('newLocationMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('HH:mm');
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">Hey, here is where I am!</a>');
  li.text(`${message.from} ${formattedTime}: `);
  a.attr('href', message.url);

  li.append(a);
  jQuery('#messages').append(li);

});