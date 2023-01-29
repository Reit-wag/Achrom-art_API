const db = require('../utils/db');

// Affiche toutes les oeuvres
const getAll = async () => {
    
    const [response, err] = await db.query('SELECT * FROM artworks');
    const artworks = [];
    
    for (let artwork of response) {
        artwork.artist = await findArtistsById(artwork.id);
        artworks.push(artwork);
    }
    return artworks;
}

// Affiche une oeuvre
const getById = async (id) => {    
    const [artwork, err] = await db.query("SELECT * FROM artworks WHERE id = ?", [id]);
    if (artwork[0] === undefined) {
        return null;
    } else {
        artwork[0].artist = await findArtistsById(id);
        return artwork[0];
    }
};

// Affiche l'artist en relation au artwork
const findArtistsById = async (id) => {
    const [artists_ids, err] = await db.query("SELECT artist_id FROM artworks_artists WHERE artwork_id = ?", [id]);
    const artists = [];
    
    const userGetById = async (id) => {
        const [user, err] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
        if (!user) {
            return null;
        } else { 
            return user[0];
        }
    };
    
    // Pour chaque artist_id, on récupère les infos de l'artist
    for (let art of artists_ids) {  

        const artist = await userGetById(art.artist_id);
        artists.push(artist.id, artist.artist_name, artist.first_name, artist.bio, artist.img_profil);
    }
    return artists;
};


// Ajouter une oeuvre
const add = async (data, artist_id) => {
    
    const [req, err] = await db.query("INSERT INTO artworks (name, style, description, year, src) VALUES (?,?,?,?,?)", 
    [
        data.name, 
        data.style, 
        data.description, 
        data.year,
        data.src,
        artist_id
    ]);
    
    if (!req) {
        return null;
    } else {
        const [reqartist, err] = await db.query("INSERT INTO artworks_artists (artwork_id, artist_id) VALUES (?, ?)", [req.insertId, artist_id]);
    }
    return getById(req.insertId);
};

// Modifier une oeuvre
const update = async (id, data) => {
    const artwork = await getById(id);
    console.log(data)
    if (!artwork) {
        return null;
    } else {
        // Définition des valeurs par défaut
        const [req, err] = await db.query("UPDATE artworks SET name = ?, style = ?, description = ?, year = ?, src = ? WHERE id = ? LIMIT 1", 
        [
            data.name        || artwork.name,
            data.style       || artwork.style,
            data.description || artwork.description,
            data.src         || artwork.src,
            data.year        || artwork.year,
            id            
        ]);
        console.log(req)
        //  si data.artist existe alors on supprime les anciennes relations et on ajoute les nouvelles
        if (data.artist) {
            const [reqDelete, err] = await db.query("DELETE FROM artworks_artists WHERE artwork_id = ?", [id]);
            if (reqDelete) {
                for (let artist of data.artist) {
                    const [reqartist, err] = await db.query("INSERT INTO artworks_artists (artwork_id, artist_id) VALUES (?, ?)", [id, artist]);
                }
            }
        }
        if (!req) {
            return null;
        }
        return getById(id);
    } 
};

// Supprime une oeuvre
const remove = async (id) => {
    const [req, err] = await db.query("DELETE FROM artworks WHERE id = ? LIMIT 1", [id]);
    if (!req) {
        return false;
    }
    return true;
};

module.exports = {
    getAll,
    getById,
    add,
    update,
    remove
};