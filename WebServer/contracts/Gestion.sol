pragma solidity ^0.5.0;
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**********************************************************STORE DATA AND EMIT EVENTS*********************************************************/

contract Gestion {

	string result = "No Query"; // The result of the query is stored in this variable

	string custom = "No request"; // We will store the complete custom request in this variable
	
	
    event customEvent (string mysqlcustom);
    // Event used to send a MySQL Query. The input is the query input. It allows to record the query
	
	
	
	function setCustom (string memory input) public {
		custom = input;
	}

	/*
	Function setCustom : 

		- input: string

		- output: none

	Changes the input of the query.The new input replaces the old one, and is stored in the Blockchain.
	Modifies the Blockchain, consumes Ether

	*/


	function getCustom () public view returns(string memory)  {
		return custom;
	}
	

	/*
	Function getCustom : 

		- input: none

		- output: string

	Returns the input of the query, stored in the blockchain.
	Only gives the state of a variable, does not modify the blockchain.
	Does not consume Ether

	*/


	function setResult(string memory input) public {
		result = input;
	}

	/*
	Function setResult : 

		- input: string

		- output: none

	Stores the result of the last request in the variable result.
	Modifies the Blockchain, consumes Ether


	*/
	

	function getResult() public view returns(string memory)  {
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

	

	function CreateCustomEvent(string memory input) public {
		emit customEvent(input);
	}

	/*
	Function CreateCustomEvent: 

		- input: string

		- output: none

	Emit a mysqlevent. The input of this event is the variable input (which is also the input of the query).
	The event is written in a log in the blockchain when it is emitted.


	*/

}
