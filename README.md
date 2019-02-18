# Blockchain Web DB

Powered by: [![N|Solid](http://gisai.dit.upm.es/wp-content/uploads/logo-gisai.png)](http://gisai.dit.upm.es/)

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

Proyecto de ejemplo para la consulta y provisi�n de informaci�n desde una p�gina Web con Node y Express hacia la Blockchain, y la provisi�n de informaci�n hacia una base de datos MySQL off-chain.

  - Caracter�stica 1
  - Caracter�stica 2

### Installation

Se requiere la instalaci�n de los siguientes paquetes software:
-  [Node.js](https://nodejs.org/) v10+.
-  [Git](https://git-scm.com/downloads) v2+.
-  [Ganache](https://truffleframework.com/ganache) v1.3+
-  Una base de datos MySQL. Recomendamos el paquete [XAMPP](https://www.apachefriends.org/download.html) v7+  

Instalamos truffle.

```sh
$ npm install -g truffle
```

Instalamos las dependencias de Web3. IMPORTANTE: Ejecutar en PowerShell y como administradores:

```sh
$ npm install --global --production windows-build-tools
```
Descargamos el repositorio de GitHub. 
En WebServer, en la carpeta build\contracts, borramos los dos archivos json q encontramos: Gestion.json y Migrations.json. Esto lo hacemos para que a la hora de migrar el contrato al blockchain no nos d� problemas, y hemos de hacerlo SIEMPRE cada vez iniciemos todo este proceso.
Abrimos un terminal, vamos a la direcci�n del proyecto:
```sh
$ truffle compile
$ truffle migrate
```
Antes de proseguir, hemos de comprobar que en el c�digo de nuestros archivos app.js y oracle.js contienen la direcci�n correcta del contrato que acabamos de desplegar en la blockchain. Para ello, vamos a Ganache, y en la pesta�a transacciones, comprobamos que, de las cuatro transacciones que tenemos actualmente, en la segunda, denominada Contract Creation, la direcci�n indicada como Created contract address coincide con la direcci�n de contrato que hemos incluido al declarar la variable Gestion en los archivos js antes mencionados.
```sh
$ npm install
$ npm run dev
```
Esta �ltima orden lanzar� el servidor en localhost:3000

Para la parte de base de datos, iniciamos nuestro servidor MySQL, nos aseguramos de que est� lanzado en localhost:3306.
Dentro del proyecto DBManager ejecutamos:
```sh
$ npm run dev
```
En la capeta documentaci�n hay un archivo sql para crear una talba de ejemplo en la base de datos y as� poder jugar con las consultas a trav�s de la blockchain. Consultas que se puede hacer:
```sql
INSERT INTO video_games (ID, name, owner, console, price, players, comments) VALUES (51, 'New Super Mario Bros', 'John', 'Wii', 4, 1, 'Incredible!')
SELECT name FROM video_games WHERE console = 'Nintendo 64'
SELECT name FROM video_games WHERE price >30
UPDATE video_games SET owner='Kathy' WHERE ID=1
```

License
----

Copyright VACADENA
**All rights reserved**
