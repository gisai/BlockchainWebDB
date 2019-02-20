//////////////////////////////////////////////////////////////////
/***************    CONNECTION WITH THE SMART CONTRACT*************/

var Web3            = require('web3'),
    path            = require('path')
    GestionJSON  = require(path.join(__dirname, '../WebServer/build/contracts/Gestion.json'));

const contractAddress = "0x0d3F97125e9482033E38c078a7Bfa07421654BF4";


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


var gestionContract = new web3.eth.Contract(GestionJSON.abi, contractAddress, { gas: 4000000 });



//////////////////////////////////////////////////////////////////////////////////

/*************************MySQL SIDE QUERY CALLED BY AN EVENT *************************/

/*var CustomMySQLEventListener = gestionContract.events.customEvent({fromBlock:0},()function(err,result){
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
	gestionContract.events.customEvent({fromBlock:0}, (error, event) => { console.log(event); }).on('data',(event) => {
	
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
  gestionContract.methods.getCustom().call({ from : web3.eth.defaultAccount}).then((result, error) => {
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
      gestionContract.methods.setResult(JSON.stringify(result)).send({ from : web3.eth.defaultAccount,gas: 2000000  });
    });
  });
}


