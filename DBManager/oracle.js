//////////////////////////////////////////////////////////////////
/***************    CONNECTION WITH THE SMART CONTRACT*************/

var Web3 = require('web3'); // Import the web3 module
if(typeof web3 !== 'undefined'){
	web3 = new Web3(web3.currentProvider);
}
else{
	//web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
	web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:7545'));
}


 web3.eth.getAccounts((err,accounts)=> {
	if (err) return;
		web3.eth.defaultAccount = accounts[0];
}); // Used to define the default acccount. This account will pay for the transactions


var Gestion = new web3.eth.Contract([
    
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
      "type": "event",
      "signature": "0x818d2411fb91789e92f56372e7b3507b252d906389d61065b79c41fbb3df6169"
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
      "type": "function",
      "signature": "0xef8adfc3"
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
      "type": "function",
      "signature": "0xd01ae036"
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
      "type": "function",
      "signature": "0x88e3cfda"
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
      "type": "function",
      "signature": "0xde292789"
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
      "type": "function",
      "signature": "0xf73361a4"
    }
  ],'0x05daB08fA1746d1730691770A67fCaccC37778cE',
  { gas: 4000000 }); // Maximun gas provided for a transaction 
  // Create an instance which refers to your smart contract, allowing you to interact with it



//////////////////////////////////////////////////////////////////////////////////

/*************************MySQL SIDE QUERY CALLED BY AN EVENT *************************/

/*var CustomMySQLEventListener = Gestion.events.customEvent({fromBlock:0},()function(err,result){
  if(!err){
    console.log('Query sent!');
    callMySQLCustom();
  }
  else{
    console.log(err);
  }
}); // This instance listen to the MySQL Event. If this event is detected, 
    // it sends a MySQL Query (using the function callMySQLCustom)
	*/
	Gestion.events.customEvent({fromBlock:0}, (error, event) => { console.log(event); }).on('data',(event) => {
	
    console.log('Received SQL query event!');
    callMySQLCustom();
  });
  
// This instance listen to the MySQL Event. If this event is detected, 
    // it sends a MySQL Query (using the function callMySQLCustom)

var prepare_query; // The input of the query is stored in this variable

var mysql = require('mysql'); //import the mysql module

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
  //	password: "gisai", // Uncomment if a password is needed
	database: "test"
}); // This instance is used to connect the oracle to the mysql database


con.connect(function(err){
	if (err) throw err;
	console.log("Connected to the Database!\n");
}); // Connect the oracle with the database




/*
Function callMySQLCustom : 

	- input: none

	- output: none

Send a MySQL query. The result of the query is stored in the Blockchain

	Uses the GetString method of the Smart Contract, and defines the data returned
by this method as the input of the query.
The result of the query ( String type) is stored in the Blockchain
It modifies the Blockchain and consummes ether

*/

function callMySQLCustom(){
  Gestion.methods.getCustom().call({ from : web3.eth.defaultAccount}).then((result, error) => {
    if(!error){
		console.log("Query to perform in DB: "+result);
      prepare_custom = result;
    }
    else{
      console.error(error);
    }
    con.query(prepare_custom, function(err, result){
      if (err) throw err;
      console.log('Result:' + JSON.stringify(result));
      Gestion.methods.setResult(JSON.stringify(result)).send({ from : web3.eth.defaultAccount,gas: 2000000  });
    });
  });
}


