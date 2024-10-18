require('dotenv').config()
var nodemailer = require('nodemailer');
const crypto = require('crypto');


// permet l'envoie d'un mail
async function envoieMail(req, res) {

    if (req.session.IdCompteUtilisateur) {
        res.status(401).json("Pas autorizer");
    }
    else {

        // récupère les élément dans le corp de la requete
        const { IdReservable ,DateDebut, DateFin, Message } = req.body;
        
        // vérifie que les élément ne soit pas à null
        if (IdReservable == null || DateDebut == null || DateFin == null || Message == null ||
            IdReservable == '' || DateDebut == '' || DateFin == '' || Message == '') {
                
                return res.status(400).json('Information manquante');
        }
            
        // récupère les information du réservable
        const reservableRecu = await recupereReservable(IdReservable);
        
        const TokenValidation = crypto.randomBytes(128).toString('base64')
        
        // créer la demande de réservation
        const reponseCreationReservation = await creerDemandeReservation(IdReservable ,DateDebut, DateFin, TokenValidation);
        
        // vérifie si toutes les requêtes sont correct
        if (!reponseCreationReservation.ok || !reservableRecu.ok) {
            return res.status(500).json("erreur serveur")
        }
        else {
            
            // construit la requete de transport pour l'envoie du mail
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.MAIL_SERVEUR,
                    pass: process.env.PASSE_MAIL_SERVEUR
                }
            });
            
            // récupère les données
            const jsonReservation = await reponseCreationReservation.json()
            const IdReservation = jsonReservation.IdReservation
            const reservableJson = await reservableRecu.json()
            
            // conctruction de l'url
            const chaine_url = `IdReservation=${IdReservation}&IdCompteUtilisateurReserve=${1}&IdReservable=${IdReservable}&DateDebutReservation=${DateDebut}&DateFinReservation=${DateFin}&TokenValidation=${TokenValidation}`;
            // encode l'url
            const chaine_url_encode = encodeURI(chaine_url);
            
            // construit les mail
            var mailOptions = {
                from: process.env.MAIL_SERVEUR,
                to: 'johanvadennewordskill@gmail.com',
                subject: `Réservation ${reservableJson.NomReservable} - ${DateDebut} / ${DateFin}`,
                text: `${Message}
                
                Validé: http://127.0.0.1:8080/api/reservation/valider?${chaine_url_encode}
                Refusé: http://127.0.0.1:8080/api/reservation/refuser?${chaine_url_encode}
                
                <button>Réserver</button>
                
                <a href="./authentification.html">Connecté vous pour réserver</a>
                `
            };
            
            
            // envoie le mail
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    return res.status(500).json("Erreur Server");
                } else {
                    return res.status(200).json("OK");
                }
            });
        }
    }
}


// retourne les info d'un réservable en fonction de sont Id
async function recupereReservable(IdReservable) {
    const response = await fetch('http://127.0.0.1:8080/api/reservable/'+IdReservable);
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération');
    }

    return response
}


// créée une demande de réservation
async function creerDemandeReservation(IdReservable ,DateDebut, DateFin, TokenValidation) {

    // construction du corps de la structure POST
    post = {"DateDebutReservation": DateDebut, "DateFinReservation": DateFin, "IdCompteUtilisateurReserve": 1, "IdReservable": IdReservable, "ReservationValide": false, "TokenValidation": TokenValidation}

    // POST -> http://127.0.0.1:8080/api/reservation
    const response = await fetch('http://127.0.0.1:8080/api/reservation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(post)
    });

    return response
}


module.exports = {
    envoieMail,
}