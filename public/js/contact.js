$('#searchBtn').on('click', searchContacts)
$('#srcContactLists').on('click','li', populateAddContactWindow);
$('#pendinglists').on('click','li', populatePendingContactWindow);
//$('#approve').on('click', approveContact);
$('#uploadProfileImage #profilePhotoUpload').on('change', uploadProfileImage)
 
function uploadProfileImage(event){
 	event.preventDefault();
	$('#uploadProfileImage').ajaxSubmit({
		success: function(response) {
		if(response.status == 'success'){
			$('.user-profile div').remove();
			$('.user-profile').html('<img class="img-circle" src="/img/profiles/'+response.id+'.png">');
		}else{
			console.log(" Error : "+response.error);
			}
		},
		error: function(response){
			console.log(" Error : "+response.error);
		}	
 	});
 }

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
    	var tableContent = '<li class="bounceInDown " id="'+this._id+'">';
        	tableContent += '<a class="clearfix" href="#"><img alt="" class="img-circle" src="http://bootdey.com/img/Content/user_1.jpg">';
        	tableContent += '<div class="friend-name"><strong>'+this.fullname+'</strong></div>';
        	tableContent += '<a></li>'
        $('#srcContactLists ul').append(tableContent);
    });
    
}

function populateAddContactWindow(){
	contactID = $(this).attr('id');
	contactName = $(this).text();
	$('#addContactForm').attr('action', '/addContact');
	$('#addContactForm #approve').attr('id', 'add').text('Add');
	$('#addContactForm #reject').attr('id', 'addCancel').text('Cancel');
	console.log(this);
    $('#addContactWindow').removeClass('display-none');
    //$('#pendingContactWindow').addClass('display-none');
    $('#addContactName .friend-name strong').text('');
    $('#addContactName .friend-name strong').text(contactName);
    console.log(contactID);
    $('#addContactForm #newUserId').val(contactID);
}

function populatePendingContactWindow(){
	contactID = $(this).attr('id');
	contactName = $(this).text();
	$('#addContactForm').attr('action', '/approveContact');
	$('#addContactForm #add').attr('id', 'approve').text('Approve');
	$('#addContactForm #addCancel').attr('id', 'reject').text('Reject');
	$('#addContactWindow').removeClass('display-none');
    //$('#pendingContactWindow').addClass('display-none');
    $('#addContactName .friend-name strong').text('');
    $('#addContactName .friend-name strong').text(contactName);
    console.log(contactID);
    $('#addContactForm #newUserId').val(contactID);
}

// function populatePendingContactWindow(){
// 	contactID = $(this).attr('id');
// 	contactName = $('#pendinglists .friend-name strong').text();
// 	$('#pendingContactWindow').removeClass('display-none');
// 	$('#addContactWindow').addClass('display-none');
// 	$('#pendingContactWindow .friend-name strong').text('');
//     $('#pendingContactWindow .friend-name strong').text(contactName);
//     console.log(contactID);
//     $('#pendingContactWindow ul li').attr('id', contactID);

// }

// function addContact(event){
// 	event.preventDefault();
// 	var newUserId = $('#pendingContactWindow ul li').attr('id');
// 	if(newUserId != ''){
// 		$.ajax({
// 	        type: 'POST',
// 	        data: { newUserId : newUserId },
// 	        url: '/addContact',
// 	        dataType: 'JSON'
// 	    }).done(function( res ) {
// 	        if (res.status == 'success') {
// 	        	console.log(res.data.username);
// 	        	$('#addContactWindow').addClass('display-none');
// 	        	$('#srcContactLists').addClass('display-none');
// 	        	$('#participants .info-msg').html('Request sent successfully');
// 	            //populateContacts(response.data);
// 	        }
// 	        else {
// 	            $('#participants .error-msg').html(res.error);
// 	        }
// 	    });
// 	} else {
// 		$('#srcInputError').html('<span>Search field blank... !<span>');
// 	}

// }

// function approveContact(event){
// 	event.preventDefault();
// 	var approveUserID = $('#pendingContactWindow ul li').attr('id');
// 	if(approveUserID != ''){
// 		$.ajax({
// 	        type: 'POST',
// 	        data: { approveUserID : approveUserID },
// 	        url: '/approveContact',
// 	        dataType: 'JSON'
// 	    }).done(function( res ) {
// 	        if (res.status == 'success') {
// 	        	console.log(res.data.username);
// 	        	$('#addContactWindow').addClass('display-none');
// 	        	//$('#srcContactLists').addClass('display-none');
// 	        	$('#participants').append('<ul><li id="'+res.data.username+'"><a href="#">"'+res.data.fullname+'"</a></li><ul>');
// 	            //populateContacts(response.data);
// 	        }
// 	        else {
// 	            alert('Error: ' + response.msg);
// 	        }
// 	    });
// 	} else {
// 		$('#srcInputError').html('<span>Search field blank... !<span>');
// 	}

// }

