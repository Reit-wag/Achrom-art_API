//  On défini les modules
const express = require('express');
const userController = require('../controllers/user.controller');

const authValidator = require('../utils/auth');


// On défini les méthodes
const router = express.Router();

//  On exporte le router
router.route('/')
    .get( authValidator.isAdmin(), async (req, res) => {
        const users = await userController.getAll();
        if(!users) {
            res.status(404).json({message: "Aucun usere n'a été trouvé !"});
        }
        res.status(200).json(users);
    })    
    .post( async (req, res) => {
        const new_user = await userController.add(req.body);
        if(!new_user) {
            res.status(404).json();
        } 
        res.status(201).json(new_user);
    })
;


router.route('/:id')
//  On affiche le artworks en relation à l'id renseigner dans le paramètre d'url
    .get( async (req, res) => {
        const user = await userController.getById(req.params.id);
        if(!user) {
            res.status(404).json({message: "Cet user n'existe pas !"});
        }
        res.status(200).json(user);
    })
    //  On modifie l'artwork en relation à l'id renseigner dans le paramètre d'url à condition d'en être l'user ou admin
    .patch(authValidator.isAuth(), async (req, res) => {
        console.log("hello")
        const new_user = await userController.update(req.params.id, req.body);
        
        //  On vérifie que l'utilisateur connecté est bien l'user ou un admin
        if (req.auth.roles != "admin" && (new_user.id != req.auth.id)) {
            
            res.status(403).json({message: "Ce n'est pas votre compte !"});

            //  On vérifie que l'user existe bien
        } else if(!new_user) {

            res.status(404).json();
        }
        res.status(200).json(new_user);
    })
    
    //  On supprime l'artwork en relation à l'id renseigner dans le paramètre d'url à condition d'en être l'user ou admin
    .delete(authValidator.isAuth(), async (req, res) => { 
        const user = await userController.remove(req.params.id);
        
        //  On vérifie que l'utilisateur connecté est bien l'usere ou un admin
        if (req.auth.roles != "admin" && (user.id != req.auth.id)) {
            
            res.status(403).json({message: "Ce n'est pas votre compte !"});

            //  On vérifie que l'user existe bien
        } else if(!user) {
            res.status(404).json();
        }
        res.status(201).json(user);
    })
;

module.exports = router;