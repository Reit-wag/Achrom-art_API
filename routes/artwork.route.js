const validator = require('../utils/validator');
const authValidator = require('../utils/auth');

//  Crée un router pour les artworks
const express = require('express');
const router = express.Router();

// Importe le controller
const artworkController = require('../controllers/artwork.controller');

// On importe le schema de validation
const artworkschema = require('../models/artwork');

// Création des routes
// Ici nous définissons les requête possible sur la route "/"
router.route('/')

//  On affiche tous les artworks
    .get( async (req, res) => {
        const artworks = await artworkController.getAll(req.auth);
        if (!artworks) {
            res.status(404).json();
        }
        res.status(200).json(artworks);
    })
    // On ajoute un artworks
    .put(authValidator.isAuth(), validator(artworkschema), async (req, res) => {

        // Je récupère l'id de l'utilisateur connecté ici
        const new_artwork = await artworkController.add(req.body, req.auth.id);
        // Si l'ajout a échoué, on renvoie une erreur 404
        if (!new_artwork) {
            res.status(404).json();
        }
        res.status(201).json(new_artwork);
    })
;

// Ici nous définissons les requête possible sur la route "/:id"
router.route('/:id')

//  Affiche l'artwork en relation à l'id renseigner dans le paramètre d'url
    .get(async (req, res) => {
        const artwork = await artworkController.getById(req.params.id);

        if (!artwork) {
            res.status(404).json();
        } else {
            res.status(200).json(artwork);
            // console.log(artwork)
        }
    })
    
    // Modifie l'artwork en relation à l'id renseigner dans le paramètre d'url à condition d'en être l'artist ou admin
    .patch(authValidator.isAuth(), validator(artworkschema), async (req, res) => {
        // Recupère l'artwork en relation à l'id renseigner dans le paramètre d'url
        const artwork = await artworkController.getById(req.params.id);
        
        if (artwork === null) {
            res.status(404).json({"message" : "Cet oeuvre n'existe pas !"});
            // Si l'utilisateur n'est pas l'artist ou admin, on renvoie une erreur 403
            console.log(req.auth.roles)

        } else if (req.auth.roles != "admin" && (artwork.artist[0] != req.auth.id)) {
            res.status(403).json({message: "Ce n'est pas votre oeuvre !"});

        } else if (!artwork) {
            res.status(404).json();

        } else {
            // On modifie l'artwork
            const updated_artwork = await artworkController.update(req.params.id, req.body);
            if (!updated_artwork) {
                res.status(404).json();
            }
            res.status(202).json(updated_artwork);
        }
    })
    
    // Supprime l'artwork en relation à l'id renseigner dans le paramètre d'url à condition d'en être l'artist ou admin
    .delete(authValidator.isAuth(), async (req, res) => {
        const artwork = await artworkController.getById(req.params.id);

        if (artwork === null) {
            res.status(404).json({"message" : "Le contenu n'existe pas !"});

        // Si l'utilisateur n'est pas l'artist ou admin, on renvoie une erreur 403
        }else if (req.auth.roles != "admin" && (artwork.artist[0] != req.auth.id)) {
        res.status(403).json({message: "Vous n'avez pas les droits pour supprimer ce contenu"});
            
        } else if (!artwork) {
            res.status(404).json({"message" : "Contenu introuvable"});

        } else {
            // On supprime l'artwork
            const removed_artwork = await artworkController.remove(req.params.id);
            if (!removed_artwork) {
                res.status(404).json();
            }
            res.status(202).json({"message" : "Contenu supprimé"});
        }
    })
;
// Export du router
module.exports = router;