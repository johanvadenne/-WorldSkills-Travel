const express = require('express');
const path = require('path');
const app = express();
const session = require('express-session');
const crypto = require('crypto');
var sessUtilisateur = null;

// Gestion de session
app.use(session({ 
    secret: 'keyboard cat', 
    resave: false, 
    saveUninitialized: false, 
    cookie: { maxAge: 600000 }
}))

// Middleware pour parser le JSON
app.use(express.json());


app.get('/', function(req, res, next) {
    if (req.session.views) {
      req.session.views++
      res.setHeader('Content-Type', 'text/html')
      res.write('<p>views: ' + req.session.views + '</p>')
      res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
      res.end()
    } else {
      req.session.views = 1
      res.end('welcome to the session demo. refresh!')
    }
  })

// dossier client web
app.get('/web/:file', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/html/', req.params.file));
});
app.get('/web/css/:file', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/css/', req.params.file));
});
app.get('/web/js/:file', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/js/', req.params.file));
});
app.get('/web/img/:dir/:file', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/image/', req.params.dir, req.params.file));
});
app.get('/web/class/:file', function (req, res) {
    res.sendFile(path.join(__dirname, '../class/', req.params.file));
});




// Controller reservable
const ReservableController = require('./controllers/reservableController');
app.get('/api/reservables', ReservableController.getReservables);
app.get('/api/reservable/:id', ReservableController.getReservable);



// controller authentification
const CompteUtilisateurController = require('./controllers/CompteUtilisateurController');
app.post('/api/connexion', async function (req, res) {
    let resultat = await CompteUtilisateurController.connexion(req, res);
    
    if (resultat.status == 200) {
        req.session.IdCompteUtilisateur = resultat.IdCompteUtilisateur;
        return res.status(resultat.status).json({ message: 'authentication réussie' });
    }
    else if  (resultat.status == 401) {
        return res.status(resultat.status).json({ message: 'authentication failed' });
    }
    else if  (resultat.status == 400) {
        return res.status(resultat.status).json({ message: 'Information manquante' });
    }
    else {
        return res.status(500).json({ message: 'Erreur server' });
    }
});
app.post('/api/inscription', async function (req, res) {
    let resultat = await CompteUtilisateurController.inscription(req, res);
    
    if (resultat.status == 200) {
        req.session.IdCompteUtilisateur = resultat.IdCompteUtilisateur;
        return res.status(resultat.status).json({ message: 'authentication réussie' });
    }
    else if  (resultat.status == 400) {
        return res.status(resultat.status).json({ message: 'Information manquante' });
    }
    else if  (resultat.status == 409) {
        return res.status(resultat.status).json({ message: 'Mail déjà existant' });
    }
    else {
        return res.status(500).json({ message: 'Erreur server' });
    }
});



// permet de savoir si l'utilisateur est connecté
app.get('/api/utilisateurAuthentifier', function (req, res) {
    if (req.session.IdCompteUtilisateur) {
        res.status(200).json({ message: 'authentifié' });
    }
    else {
        return res.status(401).json({ message: 'non authentifié' });
    }
});



// controller mail
const MailController = require('./controllers/MailController');
app.post('/api/envoiemail', MailController.envoieMail);



// controller reservation
const ReservationController = require('./controllers/ReservationController');
app.get('/api/reservation/valider', ReservationController.validerReservation);
app.get('/api/reservation/refuser', ReservationController.refuserReservation);
app.post('/api/reservation', ReservationController.insertReservation);



// Démarrer le serveur
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});