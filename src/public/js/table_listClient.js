var modal_type = 'view';

$(document).ready( function () {
    var table = $('#table_id').DataTable();
    $("#continue_modal, #skip_modal").click(function(){
	if(modal_type == 'delete'){
		window.location.href = "http://localhost:8080/client/listClients";
	}
});

} );

function peticion(identificador, accion){
	var route = '/client/';
	switch(accion){
		case 'v': 
			route += 'view'; 
			break;
		case 'd': 
			route += 'delete'; 
			break;
		case 'u': 
			route += 'update'; 
			break;
	}
	if(accion != 'u'){
		$.ajax({
    		url: route,
    		dataType: 'json',
    		type: 'POST',
    		data: {id: identificador},
    		success: function(data){     
       			switch(accion){
				case 'v': 
					modalView(data);
					break;
				case 'd': 
					modalDelete(data);
					break;
			}
   		},
    		error: function(error){    
       		console.log(error);
     		}
   		});
	}else{
		window.location.href = "http://localhost:8080/client/update?id=" + identificador;
	}
}

function modalView(client){
  modal_type = 'view';
  var html = "<p><strong>Nombre</strong>: "+client.name+"</p>";
  html += "<p><strong>Apellidos</strong>: "+client.last_name+"</p>";
  html += "<p><strong>Correo</strong>: "+client.email+"</p>";
  html += "<p><strong>Fecha</strong> de registro: "+client.creation_date+"</p>";
  var dir = (client.address.line1 == null ? '' : client.address.line1)  + " " + (client.address.line2 == null ? '' : client.address.line2) + " ";
  dir += "C.P. " + client.address.postal_code + " " + client.address.state + " " + client.address.city;
  html += "<p><strong>Direccion</strong>: "+dir+"</p>";
  html += "<p><strong>Teléfono</strong>: "+client.phone_number+"</p>";
  html += "<p><strong>Saldo</strong>: "+client.balance+"</p>";
  $("#modal-body").html(html);
  $('#clickModal').click();
}

function modalDelete(data){
  modal_type = 'delete';
  var html = "<p><strong>Estatus:</strong> " + data.description + "</p>";
  $("#modal-body").html(html);
  $('#clickModal').click();
}

function viewClient(id){
	peticion(id, 'v');
	return false;
}

function deleteClient(id){
	peticion(id, 'd');
	return false;
}

function updateClient(id){
	peticion(id, 'u');
	return false;
}