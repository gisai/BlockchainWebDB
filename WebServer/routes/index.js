var express = require('express');
var router = express.Router();

var Web3            = require('web3'),
    path            = require('path')
    GestionJSON  = require(path.join(__dirname, '../build/contracts/Gestion.json'));

const contractAddress = "0x0d3F97125e9482033E38c078a7Bfa07421654BF4";

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



var gestionContract = new web3.eth.Contract(GestionJSON.abi, contractAddress, { gas: 4000000 });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Web App for Smart Contract' });
});

router.get('/sendRequest', function(req, res, next) {
	
	  var request = req.query.request; 
	    console.log('Sending request to smart contract: '+request);
    gestionContract.methods.setCustom(request).send({ from : web3.eth.defaultAccount});
});

router.get('/getRequest', function(req, res, next) {
	
	 	  console.log('Getting stored request from smart contract');
    gestionContract.methods.getCustom().call({ from : web3.eth.defaultAccount}).then((result) => {
		if (result){
      res.writeHead(200, {'Content-Type' : 'application/json'});  // MIME Type / Internet Media Type
      res.end(JSON.stringify({ getcccustom : result + ' ' }));  // Hay que pasar un string al servidor
		} 
    });
});


router.get('/executeRequest', function(req, res, next) {
	
	 	 gestionContract.methods.getCustom().call({ from : web3.eth.defaultAccount}).then((result, error) => {
		if (result){
       gestionContract.methods.CreateCustomEvent( toString(result) ).send({ from : web3.eth.defaultAccount });
		} else {
			 console.log(error);
		}		
    });   
    console.log('MySQL custom request was sent');
});

router.get('/getResult', function(req, res, next) {
	
	 	  gestionContract.methods.getResult().call({ from : web3.eth.defaultAccount}).then((result) => {
      res.writeHead(200, {'Content-Type' : 'application/json'});
      res.end(JSON.stringify({ disssplay : result + ' ' }));
    });
});


module.exports = router;
