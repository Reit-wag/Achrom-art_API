// Appelle de ma dépendences
const express = require('express');

// On importe ici tous les fichiers "route" contenus dans le 
// dossier "routes"
const artworkRoute = require('./artwork.route');
const userRoute = require('./user.route');
const loginRoute = require('./login.route');
const artistRoute = require('./artists.route');
const messageRoute = require('./message.route');


// Appelle le router de Express...
const router = express.Router();

// Pointe chaque entité vers la bonne sous-route.
// Par exemple, si on fait une requête HTTP vers "http://localhost/api/artworks",
// on va utiliser la route définie dans "artworks.route.js".

router.use('/artworks', artworkRoute);
router.use('/users', userRoute);
router.use('/login', loginRoute);
router.use('/artists', artistRoute);
router.use('/messages', messageRoute);


// On exporte le router pour pouvoir l'utiliser dans "app.js"
module.exports = router;