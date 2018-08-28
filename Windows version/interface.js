///////////////////////////////////////////////////////////////////
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
      "name": "setString",
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
      "name": "setResult",
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
    }
  ],'0xcffe589B12a544D99629CD10CEF5d2cF7A4889DD',
  { gas: 4000000 }); // Maximun gas provided for a transaction )
  // create an instance which refers to your smart contract, allowing you to interact with it




//////////////////////////////////////////////////////////////////////////////
/********************** INTERFACE ***************************************/


/*
Function get : 

	- input: none

	- output: none

Print the current input of the query

	Allows you to use the GetString method of the Smart Contract, and print the result
GetString only gives you the state of a variable, it does not modify the blockchain,
so you can call it with the call function

*/


function get(){
	Gestion.methods.getString().call(function(error, result){ 
		if(!error){
			console.log(result);
			setTimeout(function(){write()},120);
		}
		else
			console.error(error);
	});
}



/*
Function lastquery : 

	- input: none

	- output: none

Print the result of the last query

	Allows you to use the GetResult method of the Smart Contract, and print the result
GetResult only gives you the state of a variable, it does not modify the blockchain,
so you can call it with the call function.It does not consume Ether.

*/
function lastquery(){
	Gestion.methods.getResult().call(function(error, result){
		if(!error){
			console.log(result);
			setTimeout(function(){write()},120);
		}
		else
			console.error(error);
	});
}



/*
Function set : 

	- input: string

	- output: none

Set the input of the query

	Allows you to use the SetString method of the Smart Contract, and change the input of the query
SetString modifies the blockchain, by changing the state of a variable,
so you can call it with the send function, as it needs to send a transaction. 
It consumes Ether.

*/

function set(newinput){
	Gestion.methods.setString( newinput ).send({ from : web3.eth.defaultAccount });
	//PrepareQuery();
	write();
}


/*
Function setEvent : 

	- input: none

	- output: none

Emit a SQLEvent, which triggers a MySQL Query

	Allows you to use the CreateMySQLEvent method of the Smart Contract, and emit an Event.
It modifies the blockchain, by adding a log to the blockchain,
so you can call it with the send function, as it needs to send a transaction. 
It consumes Ether.

*/


function setEvent(){
	Gestion.methods.getString().call(function(error, result){
		if (!error){
			Gestion.methods.CreateMySQLEvent( toString(result) ).send({ from : web3.eth.defaultAccount });
			setTimeout(function(){write()},120);
		}
		else
			console.log(error);
	});

}





/*
Function eventphp : 

	- input: none

	- output: none

Emit a phpEvent, which triggers a php Query

	Allows you to use the CreateMyphpEvent method of the Smart Contract, and emit an Event.
It modifies the blockchain, by adding a log to the blockchain,
so you can call it with the send function, as it needs to send a transaction. 
It consumes Ether.

*/

function eventphp(){
	Gestion.methods.getString().call(function(error, result){
		if (!error){
			Gestion.methods.CreatephpEvent( toString(result) ).send({ from : web3.eth.defaultAccount });
			setTimeout(function(){write()},120);
		}
		else
			console.log(error);
	});
}




const readline = require('readline'); // import the readline module


const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
}) // creates a readline instance, defines the keybord as the input, and the terminal as the output





var welcomemessage = "interact_with_SmartContract>"
var listofcommand= " -------------\n Type set to set the query \n Type get to see the query \n Type mysql to emit a mysql request \n Type php to emit a php request \n Type lastquery to get the last query \n Type exit to exit \n ---------------- \n";


/*
Function write : 
write
	- input: none

	- output: none

Wait for your commands. Calls the different functions.

*/


function write(){
rl.question(welcomemessage, (answer) =>{
  answer_array=answer.split(" ");
	if (answer_array[0] == 'exit'){
		process.exit();
	}
	else if (answer_array[0]== 'set'){
		set(answer_array[1]);
	}
	else if (answer_array[0] == 'get'){
		get();
	}
	else if (answer_array[0] == 'lastquery'){
		lastquery();
	}

	else if (answer_array[0] == 'mysql') {
		setEvent();
	}
	else if (answer_array[0]== 'php'){
		eventphp();
	}
	else {
		console.log(answer + ': command not found \n' + listofcommand);
		setTimeout(function(){write()},120);
	}
	});
}

setTimeout(function(){write()},500);




