function init() {

  var socket = io.connect();

  var participantID = '';
  var participantName ='';

  socket.on('connect', function () {
    console.log("new connect");
    socket.emit('new user', { id: $("#userName").attr('rel'), name: $("#userName").text() });
  });

  socket.on('new connection', function (data) {
    console.log("new connection"+ data);
    $.each(data.participants, function(){
        console.log("new connection user name: "+ this.id);
        $("#participants ul #"+this.id+" #status-online").removeClass("display-none");
        $("#participants ul #"+this.id+" #status-offline").addClass("display-none");
    });
  });

  socket.on('user disconnected', function(data) {
    console.log("user disconnected " + data.id);
    $("#participants ul #"+data.id+" #status-online").addClass("display-none");
    $("#participants ul #"+data.id+" #status-offline").removeClass("display-none");
    //console.log("#participants ul #"+this.username+" i");
  });

  socket.on('new request', function(data){
    console.log("new request arrived: "+ data.ncid);
  })

  socket.on('new contact', function(data){
    console.log("new contact: "+ data.ncid);
  })

  socket.on('new message', function (message) {
    var data =  {
          msg : message.msg,
          senderid : message.recieverid
       }
    console.log("senderID:"+message.recieverid);
    if($('#participantName').attr('rel') == message.recieverid){
      $('#messages #chatLog ul').append(printMessage('right', data));
    }else{
      var chatAlertElement = $('#participants ul #'+data.senderid+' .chat-alert');
      chatAlertElement.addClass("label-danger");
      var unreadCount = parseInt(chatAlertElement.text());
      chatAlertElement.text((isNaN(unreadCount) ? 0 : unreadCount) + 1);
    }
  });

  socket.on('error', function (reason) {
    console.log('Unable to connect to server', reason);
  });

  function sendRequest() {
  var nrid = $('#addContactForm #newUserId').val();
  if(nrid != ''){
      socket.emit('send request', { 
        nrid: nrid,
        senderid: $('#userName').attr('rel')  
      });
  }
 }

 function approveRequest(){
  if(nrid != ''){
      socket.emit('approve request', { 
        nrid: nrid,
        senderid: $('#userName').attr('rel')  
      });
  }
 }

  function sendMessage() {
    var data ={
      msg : $('#outgoingMessage').val(),
      name : $("#userName").text(),
      senderid : $('#userName').attr('rel')
    }
    socket.emit('send message', { 
      message: data.msg ,  
      name: data.name ,
      senderid: data.senderid, 
      participant: {
        participantid: participantID , 
        participantName: participantName 
      } 
    });
    $('#messages #chatLog ul').append(printMessage('left', data));
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
  $('#add').on('click', sendRequest);
  $('#approve').on('click', approveRequest);

  function populateChatWindow() {
    participantID = $(this).attr('id');
    participantName = $(this).text();
    $('#participants ul .active').removeClass('active');
    $(this).addClass('active');
    var chatAlertElement = $('#participants ul #'+participantID+' .chat-alert');
    chatAlertElement.removeClass("label-danger");
    chatAlertElement.text('');
    var senderID = $('#userName').attr('rel');
    if(participantID != ''){
    $.ajax({
          type: 'GET',
          data: { receiverid : participantID },
          url: '/chat',
          dataType: 'JSON'
      }).done(function( res ) {
          if (res.status == 'success') {
            $('#chatWindow').removeClass('display-none');
            $('#participantName').text('');
            $('#participantName').attr('rel', participantID);
            $('#participantName .friend-name').text(participantName);
            $('#messages #chatLog ul li').remove();
            $.each(res.data, function(){
              var side = participantID == this.senderid ? 'left' : 'right';
              $('#messages #chatLog ul').prepend(printMessage(side, this));
            })
          }
          else {
              alert('Error: ' + response.msg);
          }
      });
  } else {
      $('#srcInputError').html('<span>Something went wrong !<span>');
    }
  }
  function printMessage(side,data){
    var chatLog = '<li class="'+side+' clearfix"><span class="chat-img pull-'+side+'">';
        if(data.isProfilepicpath)
          chatLog += '<img alt="User Avatar" src="/img/profiles/'+ data.senderid +'.jpg">';
        else
           chatLog += '<img alt="User Avatar" src="http://bootdey.com/img/Content/user_1.jpg">';

        chatLog += '</span><div class="chat-body clearfix"><div class="header">';
        chatLog += '<strong class="primary-font">' + data.senderid + '</strong><small class="pull-right" text-muted">';
        chatLog += '<i class="fa fa-clock-o"></i> 13 mins ago</small></div><p>' + data.msg +'</p></div></li>';
    return chatLog;
  }

  $("#messages").scroll();
  $("#participants").scroll();

}

$(document).on('ready', init);
