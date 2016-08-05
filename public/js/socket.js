function init() {

  var socket = io.connect();

  var sessionId = '';

  function updateParticipants(participants) {
    $('#participants').html('');
    for (var i = 0; i < participants.length; i++) {
      if(participants[i].id != sessionId ){
        $('#participants').append('<li id="' + participants[i].id + '"><a href="#">' 
          + participants[i].name + '</a></li>');
      }
    }
    // $('#participants').append('<li id="' + participants[i].id + '"><a href="#">' +
    //     participants[i].name + ' ' + (participants[i].id === sessionId ? '(You)' : '') + '</a></li>');
  }

  socket.on('connect', function () {
    sessionId = socket.id;
    socket.emit('new user', { id: sessionId, username: $("#userInfo").attr('rel'), name: $("#userInfo").text() });
  });


  socket.on('new connection', function (data) {
    updateParticipants(data.participants);
  });

  socket.on('user disconnected', function(data) {
    $('#' + data.id).remove();
  });

  // socket.on('name changed', function (data) {
  //   $('#' + data.id).html(data.name + ' ' + (data.id === sessionId ? '(You)' : '') + '<br />');
  // });

  socket.on('new message', function (data) {
    var message = data.message;
    var name = data.name;
    $('#messages').append('<b>' + name + '</b><br />' + message +'<br />');
  });

  socket.on('error', function (reason) {
    console.log('Unable to connect to server', reason);
  });

  function sendMessage(participantID) {
    var outgoingMessage = $('#outgoingMessage').val();
    var name = $("#userInfo").text();
    socket.emit('send message', { message: outgoingMessage,  name: name, participantID: participantID });
    $('#outgoingMessage').val('');
  }

  function outgoingMessageKeyDown(event) {
    if (event.which == 13) {
      event.preventDefault();
      if ($('#outgoingMessage').val().trim().length <= 0) {
        return;
      }
      sendMessage('');
      $('#outgoingMessage').val('');
    }
  }

  function outgoingMessageKeyUp() {
    var outgoingMessageValue = $('#outgoingMessage').val();
    $('#send').attr('disabled', (outgoingMessageValue.trim()).length > 0 ? false : true);
  }

  // function nameFocusOut() {
  //   var name = $('#name').val();
  //   socket.emit('name change', { id: sessionId, name: name });
  // }
  function getChatWindow(){
    var participantID = $(this).attr('id');
    var participantName = $(this).text();
    $('#chatWindow').removeClass('postreply');
    //$('#participantName').text('');
    $('#participantName').text(function(){
      return $(this).text().replace(participantName);
    });

    //sendMessage(participantID);
  }

  $('#outgoingMessage').on('keydown', outgoingMessageKeyDown);
  $('#outgoingMessage').on('keyup', outgoingMessageKeyUp);
  $('#participants li').on('click' ,getChatWindow);
  $('#send').on('click', sendMessage);

}

$(document).on('ready', init);
