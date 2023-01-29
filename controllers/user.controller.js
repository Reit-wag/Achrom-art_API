const bcrypt = require('bcrypt');

// On appelle notre fichier de connection à Mysql
const db = require('../utils/db');

const artworkController = require('./artwork.controller');

// Affiche tout la donnée de la table users
const getAll = async () => {
    const [users, err] = await db.query("SELECT * FROM users");
    return users;
};

// Affiche la donnée d'un seul élément de la table users
const getById = async (id) => {
    const [user, err] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    if (!user) {
        return null;
    } else { 
        return user[0];
    }
};

// Ajoute un user en base
const add = async (data) => {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const [req, err] = await db.query("INSERT INTO users (email, password, artist_name, name, first_name, pays, roles, birthday, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?, NOW(), NOW())", 
    [
        data.email,
        hashedPassword,
        data.artist_name, 
        data.name, 
        data.first_name, 
        data.pays, 
        "user", 
        data.birthday
    ]);

    if (!req) {
        return null;
    }
    // On retourne l'user nouvellement créé
    return getById(req.insertId);
};

// Modifie la donnée d'un seul élément de la table users
const update = async (id, data) => {

    // On commence par récupérer l'user à modifier
    const user = await getById(id);
    console.log(user);
    if (!user) {
        return null;
    } else {
        let password;
        
        // Si on a un nouveau mot de passe, on le hash, sinon on garde l'ancien
        if (data.password) {
            password = await bcrypt.hash(data.password, 10);
        } else {
            password = user.password;
        }

        // On update l'user
        const [req, err] = await db.query("UPDATE users SET email = ?, password = ?, artist_name = ?, name = ?, first_name = ?, pays = ?, bio = ?, roles = ?, birthday = ? WHERE id = ? LIMIT 1", 
        [
            data.email          || user.email,
            password,
            data.artist_name    || user.artist_name,
            data.name           || user.name,
            data.first_name     || user.first_name,
            data.pays           || user.pays,
            data.bio            || user.bio,
            data.roles          || user.roles,
            data.birthday       || user.birthday,
            id
        ]);
        // Si la requête a échoué, on retourne null
        if (!req) {
            return null;
        }
        // On retourne l'user modifié
        return getById(id);
    } 
};

const remove = async (id) => {
    // On commence par récupérer l'user à supprimer

    const [req, err] = await db.query("DELETE FROM users WHERE id = ? LIMIT 1", [id]);
    // Si la requête a échoué, on retourne false
    if (!req) {
        return false;
    }
    return true;
};

// Affiche un user par son email et son mot de passe
const getByEmailAndPassword = async (data) => {
    // On récupère l'usere en base
    const user = await getByEmail(data);   
    // Si l'user n'existe pas, on retourne null
    if (!user) { 
        return null;
    }
    // On compare le mot de passe envoyé avec celui en base
    const hashedPassword = await bcrypt.compare(data.password, user.password);
    
    // Si le mot de passe est bon, on retourne l'usere
    if (hashedPassword) {
        return user; 
    } else {
        return null;
    }
}

// Affiche un usere par son email
const getByEmail = async (data) => {
    // On récupère l'usere en base
    const [user, err] = await db.query("SELECT * FROM users WHERE email = ?", [data.email]);
    
    // Si l'user n'existe pas, on retourne null
    if (!user || user.length == 0) {
        return null;
    }
    console.log(user[0]);
    return user[0];
}

// j'exporte mes fonctions pour pouvoir les utiliser dans mon fichier routes
module.exports = {
    getAll,
    getById,
    add,
    update,
    remove,
    getByEmailAndPassword,
    getByEmail
};