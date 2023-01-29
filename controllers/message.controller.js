const db = require('../utils/db');

// Affiche tous les messages
const getAll = async () => {    
    const [messages, err] = await db.query('SELECT * FROM messages');    
    if(!messages) {
        return null;
    } else {
    return messages;
    }
};
// Affiche une oeuvre
const getById = async (id) => {    
    const [message, err] = await db.query("SELECT * FROM messages WHERE id = ?", [id]);
    if(!message) {
        return null;
    } else {
    return message[0];
    }
};

// Ajouter un formulaire de message
const add = async (data) => {    
    const [req, err] = await db.query("INSERT INTO messages (name, email, phone, question) VALUES (?,?,?,?)", 
    [
        data.name, 
        data.email, 
        data.phone, 
        data.question
    ]);
    
    if (!req) {
        return null;
    } else {
        return req.insertId;  
    }
};

// Supprime un message
const remove = async (id) => {
    const [req, err] = await db.query("DELETE FROM messages WHERE id = ? LIMIT 1", [id]);
    if (!req) {
        return false;
    }
    return true;
};

module.exports = {
    getAll,
    getById,
    add,
    remove
};