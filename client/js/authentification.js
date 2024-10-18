//
// Script de gestion d'authentification
//



// contenue du messgae d'information concernant l'authentification de l'utilisateur
const message_connexion = document.getElementById("message_connexion");
const message_inscription = document.getElementById("message_inscription");

// Permet d'effectuer une tentative de connexion
async function connexion() {

    // Récupération des données
    let Mail = document.getElementById("MailConnexion").value;
    let MotDePasse = document.getElementById("MotDePasseConnexion").value;
    
    // mise en forme de la structure du corps de la requête
    post = {"Mail": Mail,"MotDePasse": MotDePasse}

    // POST -> http://127.0.0.1:8080/api/connexion
    const response = await fetch('http://127.0.0.1:8080/api/connexion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(post)
    });
    
    // si l'authentification est bonne créer une redirection
    if (response.ok) {
        document.location.href = "http://127.0.0.1:8080/web/index.html";
    } 
    // les champs ne sont pas tous remplies
    else if (response.status == 400) {
        message_connexion.innerHTML = "Veuillez remplir tous les champs"
    }
    // authentification raté
    else if (response.status == 401) {
        message_connexion.innerHTML = "Mail ou Mot de passe incorect"
    } 
    // sinon afficher une erreur
    else {
        message_connexion.innerHTML = "Erreur inconnu"
    }
}


// Permet d'effectuer une tentative d'inscription'
async function inscription() {

    // Récupération des données
    let NomUtilisateur = document.getElementById("NomUtilisateurInscription").value;
    let Mail = document.getElementById("MailInscription").value;
    let MotDePasse = document.getElementById("MotDePasseInscription").value;
    let MotDePasseVerifie = document.getElementById("MotDePasseVerifieInscription").value;

    if (MotDePasse != MotDePasseVerifie) {
        message_inscription.innerHTML = "Les deux mots de passe ne sont pas identiques";
    }
    else if (!validerEmail(Mail)) {
        message_inscription.innerHTML = "Le format du mail n'est pas respecté";
    }
    else {
        // mise en forme de la structure du corps de la requête
        post = {
            "NomUtilisateur": NomUtilisateur,
            "Mail": Mail,
            "MotDePasse": MotDePasse,
            "MotDePasseVerifie": MotDePasseVerifie
        }
        
        // POST -> http://127.0.0.1:8080/api/connexion
        const response = await fetch('http://127.0.0.1:8080/api/inscription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(post)
        });
        
        // si l'inscription est bonne créer une redirection
        if (response.ok) {
            document.location.href = "http://127.0.0.1:8080/web/index.html";
        } 
        // les champs ne sont pas tous remplies
        else if (response.status == 400) {
            message_inscription.innerHTML = "Veuillez remplir tous les champs"
        }
        // le mail est en double
        else if (response.status == 409) {
            message_inscription.innerHTML = "Le mail est déjà existant"
        }
        // sinon afficher une erreur
        else {
            message_inscription.innerHTML = "Erreur inconnu"
        }
    }
}


function pageInscription() {
    document.getElementById("formulaire_connexion").style.display = "none";
    document.getElementById("formulaire_inscription").style.display = "flex";
}

function pageConnexion() {
    document.getElementById("formulaire_connexion").style.display = "flex";
    document.getElementById("formulaire_inscription").style.display = "none";
}

function validerEmail(email) {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };