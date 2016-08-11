$('#searchBtn').on('click', searchContacts)
$('#srcContactLists').on('click','li', populateAddContactWindow);
$('#add').on('click', addContact);

function searchContacts(event){
	event.preventDefault();
	$('#srcContactLists').removeClass('display-none');
	$('#srcContactLists ul li').remove();
	var srcVal = $('#searchInput').val();
	if(srcVal != ''){
		$.ajax({
	        type: 'GET',
	        url: '/searchContacts?srcInput='+ srcVal,
	        dataType: 'JSON'
	    }).done(function( response ) {
	        if (response.status == 'success') {
	            populateContacts(response.data);
	        }
	        else {
	            alert('Error: ' + response.msg);
	        }
	    });
	} else {
		$('#srcInputError').html('<span>Search field blank... !<span>');
	}
		
}

function populateContacts(contacts){
	console.log("populateContacts");
	$.each(contacts, function(){
    	var tableContent = '<li class="bounceInDown " id="'+this.username+'">';
        	tableContent += '<a class="clearfix" href="#"><img alt="" class="img-circle" src="http://bootdey.com/img/Content/user_1.jpg">';
        	tableContent += '<div class="friend-name"><strong>'+this.fullname+'</strong></div>';
        	tableContent += '<a></li>'
        $('#srcContactLists ul').append(tableContent);
    });
    
}

function populateAddContactWindow(){
	contactID = $(this).attr('id');
	contactName = $(this).text();
    $('#addContactWindow').removeClass('display-none');
    $('#addContactName .friend-name strong').text('');
    $('#addContactName .friend-name strong').text(contactName);
    console.log(contactID);
    $('#addContactName ul li').attr('id', contactID);
}

function addContact(event){
	event.preventDefault();
	var newUserName = $('#addContactName ul li').attr('id');
	if(newUserName != ''){
		$.ajax({
	        type: 'POST',
	        data: { newUserName : newUserName },
	        url: '/addContact',
	        dataType: 'JSON'
	    }).done(function( res ) {
	        if (res.status == 'success') {
	        	console.log(res.data.username);
	        	$('#addContactWindow').addClass('display-none');
	        	$('#srcContactLists').addClass('display-none');
	        	$('#participants').append('<ul><li id="'+res.data.username+'"><a href="#">"'+res.data.fullname+'"</a></li><ul>');
	            //populateContacts(response.data);
	        }
	        else {
	            alert('Error: ' + response.msg);
	        }
	    });
	} else {
		$('#srcInputError').html('<span>Search field blank... !<span>');
	}

}