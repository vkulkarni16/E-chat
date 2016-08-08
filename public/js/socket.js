function init() {

  var socket = io.connect();

  var participantID = '';
  var participantName ='';

  socket.on('connect', function () {
    console.log("new connect");
    socket.emit('new user', { username: $("#userInfo").attr('rel'), name: $("#userInfo").text() });
  });


  socket.on('new connection', function (data) {
    console.log("new connection"+ data);
    $.each(data.participants, function(){
        console.log("new connection user name: "+ this.username);
        $("#participants ul #"+this.username).removeClass('offlineText');
    });
  });

  socket.on('user disconnected', function(data) {
    console.log("user disconnected " + data.username);
    $("#participants ul #"+data.username).addClass('offlineText');
  });

  socket.on('new message', function (data) {
    var message = data.message;
    var name = data.name;
    var recieverID = data.recieverID;
    console.log("senderID:"+recieverID);
    if($('#participantName').attr('rel') == recieverID){
      $('#messages>span').append('<b>' + name + '</b><br />' + message +'<br />');
    }else{
      $("#participants>ul>#"+ recieverID).addClass("active");
      console.log("active :"+ $("#participants "+ recieverID));
    }
  });

  socket.on('error', function (reason) {
    console.log('Unable to connect to server', reason);
  });

  function sendMessage() {
    var outgoingMessage = $('#outgoingMessage').val();
    var name = $("#userInfo").text();
    var senderID = $('#userInfo').attr('rel');
    socket.emit('send message', { 
      message: outgoingMessage ,  
      name: name ,
      senderID: senderID, 
      participant: {
        participantID: participantID , 
        participantName: participantName 
      } 
    });
    $('#messages>span').append('<b>' + name + '</b><br />' + outgoingMessage +'<br />');
    $('#outgoingMessage').val('');
  }

  function outgoingMessageKeyDown(event) {
    if (event.which == 13) {
      event.preventDefault();
      if ($('#outgoingMessage').val().trim().length <= 0) {
        return;
      }
      sendMessage();
      $('#outgoingMessage').val('');
    }
  }

  function outgoingMessageKeyUp() {
    var outgoingMessageValue = $('#outgoingMessage').val();
    $('#send').attr('disabled', (outgoingMessageValue.trim()).length > 0 ? false : true);
  }

  $('#outgoingMessage').on('keydown', outgoingMessageKeyDown);
  $('#outgoingMessage').on('keyup', outgoingMessageKeyUp);
  $('#send').on('click', sendMessage);
  $('#participants').on('click','li', populateChatWindow);

  function populateChatWindow() {
    participantID = $(this).attr('id');
    participantName = $(this).text();
    $("#participants>ul>#"+ participantID).removeClass("active");
    var senderID = $('#userInfo').attr('rel');
    if(participantID != ''){
    $.ajax({
          type: 'GET',
          data: { receiverid : participantID },
          url: '/chat',
          dataType: 'JSON'
      }).done(function( res ) {
          if (res.status == 'success') {
            $('#chatWindow').removeClass('postreply');
            $('#participantName').text('');
            $('#participantName').attr('rel', participantID);
            $('#participantName').text(participantName);
            $('#messages chatLog').remove();
            var chatLog = '<span id="chatLog">';
            $.each(res.data, function(){
              chatLog = '<b>' + this.senderid + '</b><br />' + this.msg +'<br />' + chatLog;
            })
            chatLog += '</span>';
            $('#messages').html(chatLog);
            console.log(res.data);
          }
          else {
              alert('Error: ' + response.msg);
          }
      });
  } else {
      $('#srcInputError').html('<span>Something went wrong !<span>');
    }
  }

}

$(document).on('ready', init);
