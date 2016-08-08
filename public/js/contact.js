$('#searchBtn').on('click', searchContacts)
$('#srcContactLists').on('click','li', populateAddContactWindow);
$('#add').on('click', addContact);

function searchContacts(event){
	event.preventDefault();
	$('#srcContactLists').removeClass('postreply');
	var srcVal = $('#searchInput').val();
	if(srcVal != ''){
		$.ajax({
	        type: 'GET',
	        //data: { srcInput : srcVal },
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
	var tableContent = '<li class="nav "><span>Search</span>';
	$.each(contacts, function(){
        tableContent += '<li id="'+this.username+'"><a href="#">' + this.fullname + '</a></li>';
    });
    tableContent += '</li><br/></hr><br/>'
    $('#srcContactLists').html(tableContent);
}

function populateAddContactWindow(){
	contactID = $(this).attr('id');
	contactName = $(this).text();
    $('#addContactWindow').removeClass('postreply');
    $('#addContactName').text('');
    $('#addContactName').text(contactName);
    console.log(contactID);
    $('#addContactName').attr('rel', contactID);
}

function addContact(event){
	event.preventDefault();
	var newUserName = $('#addContactName').attr('rel');
	if(newUserName != ''){
		$.ajax({
	        type: 'POST',
	        data: { newUserName : newUserName },
	        url: '/addContact',
	        dataType: 'JSON'
	    }).done(function( res ) {
	        if (res.status == 'success') {
	        	console.log(res.data.username);
	        	$('#addContactWindow').addClass('postreply');
	        	$('#srcContactLists').addClass('postreply');
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