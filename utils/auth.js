const config = require('../config.json');
const jwt = require('jsonwebtoken');

const isAuth = () => {
    return (req, res, next) => {
        // Je lis les headers
        const header = req.headers.authorization;
        
        if (!header) {
            res.status(401).json({message: "Vous devez être connecté"});
        }

        const access_token = header.split(" ")[1];

        jwt.verify(access_token, config.jwtPass, (err, decodedToken) => {
            if (err) {

                res.status(401).json({message: "JWT invalide"});

            } else {          

                req.auth = decodedToken;
                next();
            }
        });
    }
};

const isAdmin = () => {
    return (req, res, next) => {
        const header = req.headers.authorization;
        console.log(req)
        if (!header) {
            res.status(401).json({message: "Vous devez être connecté"});
        }
        const access_token = header.split(" ")[1];


        jwt.verify(access_token, config.jwtPass, (err, decodedToken) => {
            if (err) {
                res.status(401).json({message: "JWT invalide"});
            } else if (decodedToken.roles == 'admin') {
                // Je rajoute le token décodé (i.e. les données de l'utilisateur) dans la requete
                req.auth = decodedToken;
                // Je valide que si le user a le role "admin" dans son token
                next();
            } else {
                console.log(decodedToken)
                res.status(401).json({message: "Vous devez être administrateur"});
            }
        });
    }
};

module.exports = {
    isAuth,
    isAdmin
};