const { BDD } = require('../bdd');


// permet de validé une reservation
async function validerReservation(req, res) {

    // vérifie si les information sont correct
    if (!verifieReservation(req, res)) {
        return res.status(500).json({ message: 'Erreur serveur' });
    }
    else {
        const IdReservation = parseInt(req.query.IdReservation); // récupération de l'Id de réservation
        const client = await BDD.connect(); // connection
        await client.query('UPDATE public."T_Reservation" SET "ReservationValide" = true, "TokenValidation" = null WHERE "IdReservation" = $1', [IdReservation]); // execution de la requete
        client.release(); // fermeture de la connection
        return res.status(200).json({ message: 'Réservation accepter' });
    }
}

async function refuserReservation(req, res) {

    // vérifie si les information sont correct
    if (!verifieReservation(req, res)) {
        return res.status(500).json({ message: 'Erreur serveur' });
    }
    else {
        const IdReservation = parseInt(req.query.IdReservation); // récupération de l'Id de réservation
        const client = await BDD.connect(); // connection
        await client.query('DELETE FROM public."T_Reservation" WHERE "IdReservation" = $1', [IdReservation]); // execution de la requete
        client.release(); // fermeture de la connection
        return res.status(200).json({ message: 'Réservation refuser' });
    }
}


// vérifie si les information sont correct et qu'il y a une autorisation
async function verifieReservation(req, res) {

    // récupération des données
    const IdReservation = parseInt(req.query.IdReservation);
    const IdCompteUtilisateurReserve = parseInt(req.query.IdCompteUtilisateurReserve);
    const IdReservable = parseInt(req.query.IdReservable);
    const DateDebutReservation = (req.query.DateDebutReservation);
    const DateFinReservation = (req.query.DateFinReservation);
    const TokenValidation = (decodeURI(req.query.TokenValidation));

    const client = await BDD.connect(); // connection
    const result = await client.query(`
    SELECT * FROM public."T_Reservation" 
    WHERE "IdReservation" = $1 AND "DateDebutReservation" = $2 AND "DateFinReservation" = $3 AND "TokenValidation" = $4 AND "IdCompteUtilisateurReserve" = $5 AND "IdReservable" = $6`,
    [IdReservation,DateDebutReservation,DateFinReservation,TokenValidation, IdCompteUtilisateurReserve, IdReservable]); // execution de la requete

    const resultat = result.rows; // récupération des ligne
    client.release(); // fermeture

    return (resultat.length == 1)
}


async function insertReservation(req, res) {
    
    // récupération des données
    const { IdCompteUtilisateurReserve, IdReservable, DateDebutReservation, DateFinReservation, TokenValidation, ReservationValide } = req.body;
    const client = await BDD.connect(); // connection
    const result = await client.query(`
    INSERT INTO public."T_Reservation" ("IdCompteUtilisateurReserve", "IdReservable", "DateDebutReservation", "DateFinReservation", "TokenValidation", "ReservationValide") VALUES
    ($1, $2, $3, $4, $5, $6) RETURNING "IdReservation"`,
    [IdCompteUtilisateurReserve, IdReservable, DateDebutReservation, DateFinReservation, TokenValidation, ReservationValide]); // execution de la requete

    const resultat = result.rows; // récupération des ligne
    client.release(); // fermeture
    
    if (resultat.length == 1) {
        return res.status(200).json(resultat[0])
    }
}

module.exports = {
    validerReservation,
    refuserReservation,
    insertReservation
};
