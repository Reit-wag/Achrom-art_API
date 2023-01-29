const validator = require('../utils/validator');
const authValidator = require('../utils/auth');

//  Crée un router pour les formulaire de message
const express = require('express');
const router = express.Router();

// Importe le controller
const messageController = require('../controllers/message.controller');

// On importe le schema de validation
const messageSchema = require('../models/message');

// Création des routes
// Ici nous définissons les requête possible sur la route "/"
router.route('/')

    .get(authValidator.isAdmin(), async (req, res) => {
        const messages = await messageController.getAll(req.auth);
        if (!messages) {
            res.status(404).json();
        }
        res.status(200).json(messages);
    })
    // On ajoute un formulaire de message
    .put(validator(messageSchema), async (req, res) => {

        // Je récupère l'id de l'utilisateur connecté ici
        const new_message = await messageController.add(req.body);
        // Si l'ajout a échoué, on renvoie une erreur 404
        if (!new_message) {
            res.status(404).json();
        }
        res.status(201).json(new_message);
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
    // Supprime l'message en relation à l'id renseigner dans le paramètre d'url à condition d'en être l'artist ou admin
    .delete(authValidator.isAdmin(), async (req, res) => {
        const message = await messageController.getById(req.params.id);

        if (message === null) {
            res.status(404).json({"message" : "Le contenu n'existe pas !"});

        // Si l'utilisateur n'est pas l'artist ou admin, on renvoie une erreur 403
        }else if (req.auth.roles != "admin") {
        res.status(403).json({message: "Vous n'avez pas les droits pour supprimer ce contenu"});
            
        } else if (!message) {
            res.status(404).json({"message" : "Contenu introuvable"});

        } else {
            // On supprime l'message
            const removed_message = await messageController.remove(req.params.id);
            if (!removed_message) {
                res.status(404).json();
            }
            res.status(202).json({"message" : "Contenu supprimé"});
        }
    })
;
// Export du router
module.exports = router;