const express = require('express')
const router = express.Router();
const settings = require('../config/settings');

//Crea un nuevo cliente
router.get('/client/create', (req,res) => {
	res.render('client/createClient');
 });

//Despues del sumit
router.post('/client/newCliente', (req,res) =>{
  const {inputName,inputLname,inputEmail,inputPhone,inputAddress,inputAddress2,inputAddress3,inputCity,inputState,inputZip} = req.body;
  const customer =  req.body;
  const errors = [];
  if(!inputName)
    errors.push({ 'text': 'Falto agregar un nombre'});
  if(!inputLname)
    errors.push({ 'text': 'Falto agregar los apellidos'});
  if(!inputEmail)
    errors.push({ 'text': 'Falto agregar un correo'});
  if(!inputPhone)
    errors.push({ 'text': 'Falto agregar un teléfono'});

  return_open_pay = createCustomer(customer);
  console.log(return_open_pay);
  var estatus = true;
  if(errors.length > 0){
    estatus = false;
  	res.render('client/createClient',{
  		errors,estatus,inputName,inputLname,inputEmail,inputPhone,inputAddress,inputAddress2,inputCity,inputState,inputZip
  	});
  	console.log("Errores :/");
  }else{
    res.render('client/createClient',{
      estatus
    });
	  
  }
})

//Lista de clientes
router.get('/client/listClients', (req,res) => {
  var searchParams = {
  'limit' : 0
  };
	//class
  var Openpay = require('openpay');
  //instantiation
  var openpay = new Openpay(settings.ID, settings.keyPrivate);
  openpay.customers.list(searchParams,function(error, list) {
    //console.log(list);
    if(!error){
       res.render('client/listClient',{list});
    }else
        res.send(error);
    });
  
  });

//Buscar un cliente en especifico

router.post('/client/view', (req,res) => {
  var id = req.body.id;

  var Openpay = require('openpay');
  var openpay = new Openpay(settings.ID, settings.keyPrivate);
  openpay.customers.get(id,function(error, client) {
    if(!error){
      res.json(client);
    }else
      res.send('Error');
  });
});

router.post('/client/delete', (req,res) => {
  var id = req.body.id;

  var Openpay = require('openpay');
  var openpay = new Openpay(settings.ID, settings.keyPrivate);
  openpay.customers.delete(id,function(error) {
    if(!error){
      res.json({description: 'Exito al eliminar', http_code: 200});
    }else
      res.json(error);
  });
});

router.get('/client/update', (req,res) => {
  var id = req.query.id;
  var Openpay = require('openpay');
  var openpay = new Openpay(settings.ID, settings.keyPrivate);
  openpay.customers.get(id,function(error, customer) {
    if(customer){
      var inputID= customer.id;
      var inputName= customer.name;
      var inputEmail= customer.email;
      var inputLname= customer.last_name;
      var inputCity= customer.address.city;
      var inputState= customer.address.state;
      var inputAddress= customer.address.line1;
      var inputAddress2= customer.address.line2;
      var inputZip= customer.address.postal_code;
      var inputPhone= customer.phone_number;
      res.render('client/updateClient',{
        inputID,inputName,inputLname,inputEmail,inputPhone,inputAddress,inputAddress2,inputCity,inputState,inputZip});
    }else
      res.send('Error');
  });
});

router.post('/client/updateCliente', (req,res) => {
  const {inputID,inputName,inputLname,inputEmail,inputPhone,inputAddress,inputAddress2,inputAddress3,inputCity,inputState,inputZip} = req.body;
  const customer =  req.body;
  res_update = updateCliente(customer);
  msj = 'update_success';
  if(!res_update){
    res.send('Se guardo con exito');
  }else
    res.send(res_update);
});

function formatClient(customer_view){
var customer_openpay = {
  "name":customer_view.inputName,
  "email":customer_view.inputEmail,
  "last_name":customer_view.inputLname,
  "address":{
    "city":customer_view.inputCity,
    "state":customer_view.inputState,
    "line1":customer_view.inputAddress,
    "line2":customer_view.inputAddress2,
    "postal_code":customer_view.inputZip,
    "country_code":"MX"
  },
  "phone_number":customer_view.inputPhone
};
return customer_openpay;
}



function updateCliente(customer){
  formatC = formatClient(customer);
  var Openpay = require('openpay');
  var openpay = new Openpay(settings.ID, settings.keyPrivate);
  openpay.customers.update(customer.inputID, formatC, function(error, customer){
    if(error){
      return error;
    }else
      return;
  }
   );
}


function createCustomer(customer){
  var newCustomer = formatClient(customer);
  //{
  //"name":customer.inputName,
  //"email":customer.inputEmail,
  //"last_name":customer.inputLname,
  //"address":{
    //"city":customer.inputCity,
    //"state":customer.inputState,
    //"line1":customer.inputAddress,
    //"line2":customer.inputAddress2,
    //"postal_code":customer.inputZip,
    //"country_code":"MX"
  //},
  //"phone_number":customer.inputPhone
//};
//class
var Openpay = require('openpay');
//instantiation
var openpay = new Openpay(settings.ID, settings.keyPrivate);
//use the api
openpay.customers.create(newCustomer, function(error, body) {
  if(error)
    return error; // null if no error occurred (status code != 200||201||204)
  else 
    return body;// contains the object returned if no error occurred (status code == 200||201||204)
});
}


module.exports = router;
