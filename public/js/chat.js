var socket = io(); //initate request and keep connection open

function scrollToBottom() {
  // selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child');

  // heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', function () { // register event listener for new connections
  var params = jQuery.deparam(window.location.search);

  socket.emit('join', params, function (err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      // console.log('No error');
      // var loginName = jQuery(`<div><h4>   Logged in as: Bob</h4></div>`);
      // console.log(loginName);
      // jQuery('#users').append(loginName);
    }
  })

});

// event listeners
socket.on('disconnect', function () { // register event listener for disconnections
  // console.log('Disconnected from server')
});

socket.on('updateUserList', function(users){

  var ul = jQuery('<ul></ul>');

  users.forEach(function(user){
    ul.append(jQuery('<li></li>').text(user));
  });

  jQuery('#users').html(ul);
})

socket.on('newMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('HH:mm')
  var template = jQuery('#message-template').html();

  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('HH:mm');
  var template = jQuery('#location-message-template').html();

  var html = Mustache.render(template, {
    url: message.url,
    from: message.from,
    createdAt: formattedTime
  })

  jQuery('#messages').append(html);
  scrollToBottom();
});

var messageTextbox = jQuery('[name=message]');

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();
  var params = jQuery.deparam(window.location.search);

  socket.emit('createMessage', {
     from: params.name,
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

