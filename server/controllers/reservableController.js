const { BDD } = require('../bdd');

// Retourne tous les reservables
async function getReservables(req, res) {
    const client = await BDD.connect(); // connection
    const result = await client.query('SELECT * FROM public."T_Reservable"'); // execution de la requete
    const reservables = result.rows; // récupération des ligne
    client.release(); // fermeture de la connection
    res.status(200).json(reservables);
}

// Retourne un reservable par son ID
async function getReservable(req, res) {
    const Id = parseInt(req.params.id); // récupération de l'id
    const client = await BDD.connect(); // connection
    const result = await client.query('SELECT * FROM public."T_Reservable" WHERE "IdReservable" = $1', [Id]); // execution de la requete
    const reservable = result.rows[0]; // récupération de la ligne
    client.release(); // fermeture de la connection
    
    // vérifie que le réservable est existant
    if (!reservable) {
        return res.status(404).json({ message: 'non trouvé' });
    }

    res.status(200).json(reservable);
}

module.exports = {
    getReservables,
    getReservable,
};
