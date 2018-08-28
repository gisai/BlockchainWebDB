//////////////////////////////////////////////////////////////////
/***************    CONNECTION WITH THE SMART CONTRACT*************/

// Local tunnel:
// lt -p 80 -s mytunnel
// https://mytunnel.localtunnel.me/

// Sin local tunnel:
// localhost/phpmyadmin

var Web3 = require('web3');// Import the web3 module
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
}); // used to define the default acccount. this account will pay for the transactions


var Gestion = new web3.eth.Contract([
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "input",
          "type": "string"
        }
      ],
      "name": "mysqlevent",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "query_input",
          "type": "string"
        }
      ],
      "name": "phpEvent",
      "type": "event"
    },
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
      "name": "setString",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getString",
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
      "name": "CreateMySQLEvent",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
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
      "name": "CreatephpEvent",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
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
  // Create an instance which refers to your smart contract, allowing you to interact with it



//////////////////////////////////////////////////////////////////////////////////

/*************************MySQL SIDE QUERY CALLED BY AN EVENT *************************/

// event_filter = mycontract.events.myEvent.createFilter(fromBlock='latest', argument_filters={'arg1':10})
var MySQLEventListener = Gestion.events.mysqlevent({fromBlock:0},function(err,result){
	if(!err){
		console.log('Query sent!');
		callmysql();
	}
	else{
		console.log(err);
	}
}); // This instance listen to the MySQL Event. If this event is detected, 
    // it sends a MySQL Query (using the function call)

var CustomMySQLEventListener = Gestion.events.customEvent({fromBlock:0},function(err,result){
  if(!err){
    console.log('Query sent!');
    callMySQLCustom();
  }
  else{
    console.log(err);
  }
}); // This instance listen to the MySQL Event. If this event is detected, 
    // it sends a MySQL Query (using the function call)

var prepare_query; // The input of the query is stored in this variable

var mysql = require('mysql'); //import the mysql module

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
//	password: "gisai", // Uncomment if a password is needed
	database: "test"
}); // this instance is used to connect the oracle to the mysql database


con.connect(function(err){
	if (err) throw err;
	console.log("Connected to the Database!\n");
});// connect the oracle with the database




/*
Function call : 

	- input: none

	- output: none

Send a MySQL query. The result of the query is stored in the Blockchain

	Uses the GetString method of the Smart Contract, and defines the data returned
by this method as the input of the query.
The result of the query ( String type) is stored in the Blockchain
It modifies the Blockchain and consummes ether

*/




function callmysql(){
	Gestion.methods.getString().call(function(error, result){
		if(!error){
			prepare_query=result;
		}
		else{
			console.error(error);
		}
		con.query( "SELECT name FROM video_games WHERE owner = \'"+ prepare_query+"\'", function(err, result){
		// con.query( "SELECT nom FROM jeux_video WHERE possesseur = \'"+ prepare_query+"\'", function(err, result){
		  if (err) throw err;
		  console.log('Result:' + JSON.stringify(result));
		  Gestion.methods.setResult(JSON.stringify(result)).send({ from : web3.eth.defaultAccount });
		});
	});
}

function callMySQLCustom(){
  Gestion.methods.getCustom().call(function(error, result){
    if(!error){
      prepare_custom=result;
    }
    else{
      console.error(error);
    }
    con.query(prepare_custom, function(err, result){
    // con.query( "SELECT nom FROM jeux_video WHERE possesseur = \'"+ prepare_query+"\'", function(err, result){
      if (err) throw err;
      console.log('Result:' + JSON.stringify(result));
      Gestion.methods.setResult(JSON.stringify(result)).send({ from : web3.eth.defaultAccount });
    });
  });
}

//////////////////////////////////////////////////////////////////////////////////////////
/******************************* PHP CALL ***********************************************/


var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;  // import the XMLHttpRquest module
var xhr = new XMLHttpRequest(); // creates a XMLHttpRequest instance, needed to send an Http Request


var phpListener= Gestion.events.phpEvent({fromBlock:0},function(err,result){
	if(!err){
		console.log('Query sent!');
		callphp();
	}
	else{
		console.log(err);
	}
}); // This instance listen to the php Event. If this even is detected, 
    // it sends a php Query (using the function callphp)




/*
Function callphp : 

	- input: none

	- output: none

Send a php query. The result of the query is stored in the Blockchain

	Uses the GetString method of the Smart Contract, and defines the data returned
by this method as the input of the query.
The result of the query ( String type) is stored in the Blockchain
It modifies the Blockchain and consummes ether

*/


function callphp(){
	Gestion.methods.getString().call(function(error, result){
		if(!error){
			prepare_query=result;
		}
		else{
			console.error(error);
		}
		//  xhr.open('GET',"http://mytunnel.localtunnel.me/test/BDD.php?possesseur=" + prepare_query,false);
		xhr.open('GET',"http://localhost/test/BDD.php?owner=" + prepare_query,false);
  		//xhr.open('GET',"http://localhost/test/BDD.php?possesseur=" + prepare_query,false);
	 	xhr.send(null);
    	// Hay que indicar bien la ruta donde tememos el archivo BDD.php, en nuestro caso, en la carpeta llamada test, 
    	// dentro de la carpeta www de wamp64
    	// Hemos cambiado la ruta para no usar localtunnel
    	// Si pegamos en el Internet Explorer http://localhost/test/BDD.php?owner=homer, si todo va bien
    	// debería darnos un resultado

	  	console.log(xhr.responseText);

    Gestion.methods.setResult( xhr.responseText ).send({ from : web3.eth.defaultAccount });
	});
}



