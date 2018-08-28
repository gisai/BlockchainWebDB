pragma solidity ^0.4.21;
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**********************************************************STORE DATA AND EMIT EVENTS*********************************************************/

contract Gestion {

	string queryinput = "init"; // The input of the request is stored in this variable

	string result = "No Query"; // The result of the query is stored in this variable

	string custom = "No request"; // We will store the complete custom request in this variable
	
	event mysqlevent (string input); 
	// Event used to send a MySQL Query. The input is the query input. It allows to record the query

	event phpEvent(string query_input); 
	// Event used to send a PHP Query. The input is the query input. It allows to record the query

    event customEvent (string mysqlcustom);

	function setString (string input) public {
		queryinput = input;
	}

	/*
	Function setString : 

		- input: string

		- output: none

	Changes the input of the query.The new input replaces the old one, and is stored in the Blockchain.
	Modifies the Blockchain, consumes Ether

	*/

	


	function getString () public constant returns(string)  {
		return queryinput;
	}
	
	/*
	Function getString : 

		- input: none

		- output: string

	Returns the input of the query, stored in the blockchain.
	Only gives the state of a variable, does not modify the blockchain.
	Does not consume Ether

	*/


	function setCustom (string input) public {
		custom = input;
	}


	function getCustom () public constant returns(string)  {
		return custom;
	}
	

	function setResult(string input) public {
		result = input;
	}

	/*
	Function setResult : 

		- input: string

		- output: none

	Stores the result of the last request in the variable result.
	Modifies the Blockchain, consumes Ether


	*/
	

	function getResult() public constant returns(string)  {
		return result;
	}
	
	/*
	Function getResult : 

		- input: none

		- output: string

	Returns the result of the last query, stored in the blockchain in the variable result.
	Only gives the state of a variable, does not modify the blockchain.
	Does not consume Ether

	*/


	
	function CreateMySQLEvent(string input) public {
		emit mysqlevent(input);
	}
	
	/*
	Function CreateMySQLEvent: 

		- input: string

		- output: none

	emit a mysqlevent. The input of this event is the variable input (which is also the input of the query).
	The event is written in a log in the blockchain when it is emitted.


	*/

	

	function CreatephpEvent(string input) public {
		emit phpEvent(input);
	}

	/*
	Function CreatephpEvent: 

		- input: string

		- output: none

	emit a phpevent. The input of this event is the variable input (which is also the input of the query).
	The event is written in a log in the blockchain when it is emitted.


	*/

	function CreateCustomEvent(string input) public {
		emit customEvent(input);
	}

}
