

var gestionModel = {};

gestionModel.jsonInterface = [
    
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
  ];
  
  gestionModel.address = '0x05daB08fA1746d1730691770A67fCaccC37778cE';
gestionModel.options = { gas: 4000000 }; // Maximun gas provided for a transaction  
  // Create an instance which refers to your 
  // smart contract, allowing you to interact with it

module.exports = gestionModel;