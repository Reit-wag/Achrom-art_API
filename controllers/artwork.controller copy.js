const db = require('../utils/db');

// Affiche toutes les oeuvres
const getAll = async () => {

    const [response, err] = await db.query('SELECT * FROM artworks');
    const artworks = [];
    // Pour chaque oeuvre, on récupère les infos de l'artiste
    for (let artwork of response) {
        artwork.artist = await findArtistsById(artwork.id);
        artworks.push(artwork);
    }
    return artworks;
}


// Affiche l'artist en relation au artwork
const findArtistsById = async (id) => {

    const [artists_ids, err] = await db.query("SELECT artist_id FROM artworks_artists WHERE artwork_id = ?", [id]);
    const artists = [];

    // Pour chaque artiste, on récupère les infos de l'artiste
    for (let art of artists_ids) {
        console.log(art)

        const artist = await getByIds(art.artist_id);
        artists.push(artist.id, artist.artist_name, artist.first_name, artist.bio, artist.img_profil);
    }
    return artists;
};

//  Affiche un artiste
const getByIds = async (id) => {
    const [user, err] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    // console.log("Step 3")
    if (!user) {
        return null;
    } else { 
        return user[0];
    }
};

// Affiche une oeuvre
const getById = async (id) => {
    
    const [artwork, err] = await db.query("SELECT * FROM artworks WHERE id = ?", [id]);
    if (!artwork) {
        return null;
    } else {
        return artwork[0];
    }
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
    if (!artwork) {
        return null;
    } else {
        
        const [req, err] = await db.query("UPDATE artworks SET name = ?, artist = ?, style = ?, description = ?, year = ?, src = ? WHERE id = ? LIMIT 1", 
        [
            data.name        || artwork.name,
            data.artist      || artwork.artist,
            data.style       || artwork.style,
            data.description || artwork.description,
            data.year        || artwork.year,
            data.src         || artwork.src,
            id
        ]);

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



module.exports = {
    getAll,
    getById,
    add,
    update
};