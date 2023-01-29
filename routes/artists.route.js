const express = require('express');

const artistsController = require('../controllers/artist.controller');
const artworkController = require('../controllers/artwork.controller');
const artworkschema = require('../models/artwork');
const validator = require('../utils/validator');
const authValidator = require('../utils/auth');

const router = express.Router();




router.route('/')
    .get( async (req, res) => {
        const artists = await artistsController.getAll(req.auth);
        if (!artists) {
            res.status(404).json();
        }
        res.status(200).json(artists);
        console.log(artists)
    })

    
;

module.exports = router;