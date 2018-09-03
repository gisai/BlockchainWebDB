//////////////////////////////////////////////////////////////////
/***************    CONNECTION WITH THE SMART CONTRACT*************/
var http = require('http');
var url = require('url');
var fs = require('fs');

var Web3 = require('web3'); // Import the web3 module
if(typeof web3 !== 'undefined'){
	web3 = new Web3(web3.currentProvider);
}
else{
  //web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
  web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:7545'));
}

web3.eth.getAccounts((err,accounts)=> {
	if (err) return
		web3.eth.defaultAccount = accounts[0];
}); // used to define the default account. this account will pay for the transactions


var Gestion = new web3.eth.Contract(  [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "mysqlcustom",
          "type": "string"
        }
      ],
      "name": "customEvent",
      "type": "event"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "input",
          "type": "string"
        }
      ],
      "name": "setCustom",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getCustom",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "input",
          "type": "string"
        }
      ],
      "name": "setResult",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getResult",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "input",
          "type": "string"
        }
      ],
      "name": "CreateCustomEvent",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],'0xcffe589B12a544D99629CD10CEF5d2cF7A4889DD',
  { gas: 4000000 }); // Maximun gas provided for a transaction  
  // Create an instance which refers to your 
  // smart contract, allowing you to interact with it


var server = http.createServer(function(req, res) {  // Creamos un servidor

  var url_parts = url.parse(req.url, true);  // Dividimos la URL en partes

  // Vamos añadiendo las diferentes posibles querys
  
  var setcustom = url_parts.query.setcustom;  
  var mysqlcustomrequest = url_parts.query.mysqlcustomrequest;
  var refreshcustom = url_parts.query.refreshcustom;
  var getresults = url_parts.query.getresults;


  if (setcustom){
    console.log('Request ready!');
    Gestion.methods.setCustom(setcustom).send({ from : web3.eth.defaultAccount});
  } 

  else if (mysqlcustomrequest){
    Gestion.methods.getCustom().call(function(error, result){
    if (!error){
      Gestion.methods.CreateCustomEvent( toString(result) ).send({ from : web3.eth.defaultAccount });
    }
    else
      console.log(error);
    });
    console.log('MySQL custom request was sent');
  } 

  else if (refreshcustom){
    Gestion.methods.getCustom().call(function(error, result){
      res.writeHead(200, {'Content-Type' : 'application/json'});  // MIME Type / Internet Media Type
      res.end(JSON.stringify({ getcccustom : result + ' ' }));  // Hay que pasar un string al servidor
    });
  }

  else if (getresults){
    Gestion.methods.getResult().call(function(error, result){
      res.writeHead(200, {'Content-Type' : 'application/json'});
      res.end(JSON.stringify({ disssplay : result + ' ' }));
    });
  }

  else {
    console.log('Reloaded!');
    res.writeHead(200, {'Content-Type' : 'text/html'});
    fs.readFile('index.html',function(err, data){
      res.end(data);
    });
  }

}).listen(1337,'127.0.0.1'); // La IP 127.0.0.1 se refiere al localhost. Es la dirección de loopback
                             // Es la dirección que apunta a nuestro pc, desde nuestro pc

