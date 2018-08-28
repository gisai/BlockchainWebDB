
<?php 
	try {

		$bdd = new PDO('mysql:host=localhost;dbname=test;charset=utf8','root','');
		// creation of an instance of the PHP Data Object (PDO) class, which helps the php file to interact with the database.
		// You need to specify : 
		// the host (here, the file is stored locally donc localhost)
		// the database
		// your login (here, root)
		// El último campo es la contraseña, que no necesitamos aquí

		array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION); // set the error mode
		// Crea un array asociativo
		// ATRR_ERRMODE atributo que se usa para reportar errores
		// ERRMODE_EXCEPTION este valor lanza excepciones. Si hay un error en SQL, PDO lanzará una excepción y el script dejará de funcionar. Su valor es 2
	}

	catch (Exception $e){
		die('error :'.$e -> getMessage()); // die equivale a salir
	}
	
	$data = ' '; // We create a variable where we will store the result as a string of characters

	$response = $bdd -> query('SELECT name FROM video_games WHERE owner=\'' . $_GET['owner'] . '\'');
	// $response = $bdd -> query('SELECT nom FROM jeux_video WHERE possesseur=\'' . $_GET['possesseur'] . '\''); 
	// The query is prepared and sent here. The "possesseur" should be specified in the URL of the HTTP request
	// $response contiene una colección de filas (rows) devueltas tras la query

	while ($datos = $response -> fetch()){ // The response can be considered as an array. With the fetch function, we can treat each line of the array. While we did not reach the last line (which is empty) :
	// fetch() obtiene la siguiente fila de la variable $response
	// while (true) do something
	// If it's while(array(with elements)) it resolves the while condition in True and allow to perform an iteration.
    // If it's while(NULL) it resolves the while condition in False and exits the loop 
	
		//$data = $data.$datos['nom']; // The filed "nom" of the response is added to the data variable
		$data = $data.$datos['name'];
	}

	$response -> closeCursor(); // We close the cursor inside the "response" variable
	// Libera la conexión al servidor, por lo que otras sentencias SQL podrían ejecutarse, pero deja la sentencia en un estado que la habilita para ser ejecutada otra vez
?>


<?php
 	echo $data 
 	// We use echo to send the value of the data variable
 	// echo saca por pantalla los datos
?> 



