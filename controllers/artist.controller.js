const db = require('../utils/db');
const userController = require('./user.controller'); 

// Affiche affiche les artistes
const getAll = async () => {
    const [response, err] = await db.query("SELECT * FROM users");
    const artists = [];


        for (let artist of response) {
            console.log(artists)
            if (artist.artist_name !== "Admin") {
                artists.push([artist.id, artist.artist_name, artist.first_name, artist.bio, artist.img_profil]);
            }
        }
        return artists;      
};

// const findArtistByName = async (name) => {
//     const [artist, err] = await db.query("SELECT * FROM users WHERE artist_name = ?", [name]);
//     if (!artist) {
//         return null;
//     }
//     return artist[0];
// };

const findArtistsById = async (id) => {

    const [artist_ids, err] = await db.query("SELECT artist_id FROM artworks_artists WHERE artwork_id = ?", [id]);
    const artists = [];

    for (let art of artist_ids) {

        const artist = await userController.getById(art.artist_id);
        
        artists.push(artist);
    }
    return artists;
};

module.exports = {
    getAll,
    findArtistsById
}