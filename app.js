// Importe nos dépendences
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Importe notre fichier "config.json" dans lequel 
// se trouvent les paranètres de notre serveur.
const config = require('./config');

// Importe le dossier 'routes'
// Par défaut, node va chercher un fichier "index.js" à l'intérieur.
const routes = require('./routes');

// Création de nos middleware

// Crée une application Express
const app = express();

// Morgan, pour afficher les logs des requêtes HTTP dans la console
app.use(morgan('dev'));

// Cors, pour securiser nos requêtes HTTP
app.use(cors());

// JSON du paquet Express, pour permettre à Express de parser le JSON 
// envoyé dans le corps des requêtes
app.use(express.json());

// On définit notre route principale
app.use(config.basePath, routes);


// Notre serveur Express fonctionne sur le port 5000
// Défini au préalable dans notre fichier "config.json"
app.listen(config.port, () => {
    console.log("Server up on port " + config.port);
});
