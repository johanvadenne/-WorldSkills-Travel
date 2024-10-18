var sha256 = require('js-sha256').sha256;
const { BDD } = require('../bdd');

// Vérifie si l'utilisateur est existant dans la base de données
async function connexion(req, res) {

    // Récupérer les données du corps de la requête
    const { Mail, MotDePasse } = req.body;

    // Vérifier si les données nécessaires sont fournies
    if (!Mail || !MotDePasse) {
        return {"status": 400} // 'Information manquante'
    }

    // connection bdd
    const client = await BDD.connect();
    // requete préparé
    const result = await client.query('SELECT "IdCompteUtilisateur" FROM public."T_CompteUtilisateur" WHERE "Mail" = $1 AND "MotDePasse" = $2;', [sha256(Mail), sha256(MotDePasse)]);
    // récupération des résultat
    const resultat = result.rows;
    // fermeture
    client.release();
    
    // si pas compte retourner
    if (resultat.length == 0) {
        return {"status": 401} // 'authentication failed'
    }
    // si un compte est retourner
    else if  (resultat.length == 1) {
        return {"status": 200, "IdCompteUtilisateur": resultat[0].IdCompteUtilisateur} // 'authentication réussie'
    }
    // d'en d'autres cas
    else {
        return {"status": 500} // 'Erreur server'
    }
}

// Vérifie si l'utilisateur est existant dans la base de données
async function inscription(req, res) {

    // Récupérer les données du corps de la requête
    const { Mail, MotDePasse, NomUtilisateur } = req.body;

    // Vérifier si les données nécessaires sont fournies
    if (!Mail || !MotDePasse || !NomUtilisateur) {
        return {"status": 400} // 'Information manquante'
    }
    else if (!MailInexistant(Mail)) {
        return {"status": 409}
    }

    // connection bdd
    const client = await BDD.connect();
    // requete préparé
    const result = await client.query(`INSERT INTO public."T_CompteUtilisateur" ("Mail", "MotDePasse", "NomUtilisateur") VALUES 
    ($1, $2, $3) RETURNING "IdCompteUtilisateur";`, 
    [sha256(Mail), sha256(MotDePasse), NomUtilisateur]);
    // récupération des résultat
    const resultat = result.rows;
    // fermeture
    client.release();
    
    return {"status": 200, "IdCompteUtilisateur": resultat[0].IdCompteUtilisateur}
}

// Vérifie si l'utilisateur qui vas être créer n'existe déjà pas en se basant sur le mail dans la base de données
async function MailInexistant(Mail) {

    // connection bdd
    const client = await BDD.connect();
    // requete préparé
    const result = await client.query('SELECT "IdCompteUtilisateur" FROM public."T_CompteUtilisateur" WHERE "Mail" = $1;', [sha256(Mail)]);
    // récupération des résultat
    const resultat = result.rows;
    // fermeture
    client.release();
    
    if  (resultat.length == 0) {
        return true
    }
    else {
        return false
    }
}

module.exports = {
    connexion,
    inscription,
};
