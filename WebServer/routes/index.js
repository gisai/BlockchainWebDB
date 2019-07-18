var express = require('express');
var router = express.Router();

var Web3            = require('web3'),
    path            = require('path')
    GestionJSON  = require(path.join(__dirname, '../build/contracts/Gestion.json'));

//const contractAddress = "0x0d3F97125e9482033E38c078a7Bfa07421654BF4";
const contractAddress = "0xEb6126a371FcD161481866Ed966FfacFdfC5f5CD";
//const contractAddress = "0x37E06eCD0C2711D6f3478dF90C965fc4C203057b";

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

var topicsCustomEvent = "0x818d2411fb91789e92f56372e7b3507b252d906389d61065b79c41fbb3df6169";

async function getResultSC(){  
 	var result;
// 	 console.log("Entra a la funcion " + result)
 	try{
//  		console.log("Entra al try " + result)
 		result = await gestionContract.methods.getResult().call({ from : web3.eth.defaultAccount});
 		console.log("***getResultSC*** Dentro del try el resultado del sc " + result);
 		console.log(result);
 	}catch(err){ 
		console.log("***getResultSC*** Imprimiendo error");
 	}
	return await result;
}

async function getTransactionByHash(hash){  
 	var result;
 	 console.log("Entra a la funcion getTransactionByHash " + result)
 	try{
// 		console.log("Entra al try " + result)
 		result = await web3.eth.getTransaction(hash);
 		console.log("***getTransactionByHash*** Dentro del try el resultado de la busqueda ");
 		console.log(result)
 	}catch(err){ 
		console.log("***getTransactionByHash*** Imprimiendo error");
 	}
	return await result;
}

async function getBlockByNOrHash(hash){  
 	var result;
 	 console.log("Entra a la funcion getTransactionByHash " + result)
 	try{
// 		console.log("Entra al try " + result)
 		result = await web3.eth.getBlock(hash);
 		console.log("***getTransactionByHash*** Dentro del try el resultado de la busqueda ");
 		console.log(result)
 	}catch(err){ 
		console.log("***getTransactionByHash*** Imprimiendo error");
 	}
	return await result;
}

async function decodEvent(rawdata){
//	console.log("Llego a decodEvent " + "0x"+rawdata.substr(10) )
	var result = await web3.eth.abi.decodeLog([{
          "indexed": false,
          "name": "mysqlresult",
          "type": "string"
        }],"0x"+rawdata.substr(10), topicsCustomEvent)//;.mysqlresult;
	console.log(result);
	return result;
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Web App for Smart Contract' });
});

router.get('/sendRequest', function(req, res, next) {
	
	  var request = req.query.request; 
	  console.log('Sending request to smart contract: '+request);
      //gestionContract.methods.setResult(request).send({ from : web3.eth.defaultAccount})
		gestionContract.methods.CreateCustomEvent(request).send({ from : web3.eth.defaultAccount })
		.on('transactionHash', (hash) => {
   			console.log(hash);
		})

});
/*
router.get('/getRequest', async function(req, res, next) {
	
	 	console.log('*** /getRequest*** Getting stored request from smart contract');
		var result = await getResultSC();
		if(result){
			res.writeHead(200, {'Content-Type' : 'application/json'});  // MIME Type / Internet Media Type
	      	res.end(JSON.stringify({ getcccustom : result + ' ' }));  // Hay que pasar un string al servidor
		}

});


router.get('/executeRequest', function(req, res, next) {
		getResultSC()
		.then( result => {	
			console.log("*** /executeRequest*** Resultado del metodo: " + result)
			if(result){
				console.log("*** /executeRequest*** Recibido del SC: " + result + " listo para lanzar evento")
      			gestionContract.methods.CreateCustomEvent(result).send({ from : web3.eth.defaultAccount })
			}
    	});   
    	console.log('MySQL custom request was sent');
});

router.get('/getResult', function(req, res, next) {
		getResultSC()
		.then(result => {
			console.log("*** /getResult*** Resultado del metodo: " + result)
			if(result){
		      res.writeHead(200, {'Content-Type' : 'application/json'});
		      res.end(JSON.stringify({ disssplay : result + ' ' }));
			}
	    });
});

*/
router.get('/sendHash', async function(req, res, next) {
		var hash = req.query.request; 
		var result = await getTransactionByHash(hash)
		
	  		console.log('*** /sendHash*** Looking for hash in smart contract: '+ hash);
	  		if(result){
 				console.log("***sendHash*** Dentro del try el resultado de la busqueda ");
 				console.log(result)
 				 try {
 				var dataDecod =  await decodEvent(result.input);
		      	if(dataDecod){
		      	res.writeHead(200, {'Content-Type' : 'application/json'});
		      	res.end(JSON.stringify({ disssplay1 : result.hash + ' ' , disssplay2 : result.nonce + ' ',
		      	 disssplay3 : result.blockHash + ' ', disssplay4 : result.blockNumber + ' ',
		      	  disssplay5 : result.transactionIndex + ' ', disssplay6 : result.from + ' ',
		      	   disssplay7 : result.to + ' ', disssplay8 : result.value + ' ',
		      	    disssplay9 : result.gas + ' ', disssplay10 : result.gasPrice + ' ',
		      	     disssplay11 : result.input + ' ', disssplay12 : dataDecod + ' '}));
				}
				    } catch(err) {
        console.log(err);
    }
			}
		});

router.get('/getBlock', function(req, res, next) {
		  var hash = req.query.request; 

		getBlockByNOrHash(hash)
		.then(result => {
	  		console.log('*** /getBlock*** Looking for hash in smart contract: '+ hash);
	  		if(result){
 				console.log("***getBlock*** Dentro del try el resultado de la busqueda ");
 				console.log(result)
		      res.writeHead(200, {'Content-Type' : 'application/json'});
		      res.end(JSON.stringify({ blockData : result.number + ' ' , blockData2 : result.hash + ' ',
		       blockData3 : result.parentHash + ' ', blockData4 : result.mixHash + ' ',
		        blockData5 : result.nonce + ' ', blockData6 : result.sha3Uncles + ' ',
		         blockData7 : result.logsBloom + ' ', blockData8 : result.transactionsRoot + ' ',
		          blockData9 : result.stateRoot + ' ', blockData10 : result.receiptsRoot + ' ',
		           blockData11 : result.miner + ' ', blockData12 : result.difficulty + ' ', blockData13 : result.totalDifficulty + ' ',
		            blockData14 : result.extraData + ' ', blockData15 : result.size + ' ', blockData16 : result.gasLimit + ' ',
		            blockData17 : result.gasUsed + ' ', blockData18 : result.timestamp + ' ', blockData19 : result.transactions + ' '}));
			}
		});
});

module.exports = router;
