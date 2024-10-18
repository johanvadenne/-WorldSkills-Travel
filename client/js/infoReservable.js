//
// Affichage des informations du reservables et d'un formulaire si l'utilisateur est connecté
//
// envoie d'un mail à partir du formulaire de réservation
//


// récupère l'id du réservable dans l'url
const params_for_mail = new URLSearchParams(window.location.search);
const IdReservable = params_for_mail.get('IdReservable') || 0;

// éléments html qui seront alimenté
const description_reservable = document.getElementById("description_reservable");
const description_reservable_img = document.getElementById("description_reservable_img");
const titreFormulaire = document.getElementById("titreFormulaire");

// récupère les données d'un reservables
async function getReservable() {
    // GET -> http://127.0.0.1:8080/api/reservable/IdReservable <- int
    const response = await fetch('http://127.0.0.1:8080/api/reservable/'+IdReservable);
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération');
    }
    else {
        // convertion du json une classe Cl_Reservable
        const reservableRecu = await response.json();
        var reservable = new Cl_Reservable(
            reservableRecu.IdReservable,
            reservableRecu.NomReservable,
            reservableRecu.Prix,
            reservableRecu.Pays,
            reservableRecu.Region,
            reservableRecu.Ville,
            reservableRecu.Adresse,
            reservableRecu.IdCompteUtilisateurProprietaire,
            reservableRecu.LienImage
        );
    
        return reservable;
    }

}

async function afficheReservable() {
    // récupère les données
    const reservable = await getReservable();

    // afiche l'image
    description_reservable_img.innerHTML = `<img class="m-10 rounded-xl w-full" src="./img/bdd-image/${reservable.LienImage}">`
    
    // afiche les données complémentaire
    description_reservable.innerHTML = `
    <p>NomReservable: ${reservable.NomReservable}</p>
    <p>Prix: ${reservable.Prix}</p>
    <p>Pays: ${reservable.Pays}</p>
    <p>Region: ${reservable.Region}</p>
    <p>Ville: ${reservable.Ville}</p>
    <p>Adresse: ${reservable.Adresse}</p>
    <p>Proprietaire: ${reservable.IdCompteUtilisateurProprietaire}</p>
    `
    
    let utilisateurAuthentifier = await verifieUtilisateurAuthentifier();

    // laisser le formulaire de réservation afficher si l'utilisateur est authentifier
    if (utilisateurAuthentifier) {
        // affichage du formulaire
        document.getElementById("formulaire_reservation").style.display = "flex"
        titreFormulaire.innerHTML = "Réservation "+reservable.NomReservable;
    }
    else {
        // affichage du formulaire
        document.getElementById("demande_connexion").style.display = "flex"
    }
}

async function verifieUtilisateurAuthentifier() {
    const response = await fetch('http://127.0.0.1:8080/api/utilisateurAuthentifier');
    return response.ok
}

async function envoieMail() {
    
    // si IdReservable n'est pas définer alors afficher une page d'erreur
    if (IdReservable == 0) {
        afficherErreur();
    }
    
    // récupération des information du formulaire
    const DateDebut = document.getElementById("DateDebut").value;
    const DateFin = document.getElementById("DateFin").value;
    const Message = document.getElementById("Message").value;

    // structuration des données du corp de la requête
    post = {"IdReservable": IdReservable, "DateDebut": DateDebut, "DateFin": DateFin, "Message": Message, }

    const response = await fetch('http://127.0.0.1:8080/api/envoieMail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(post)
    });
    
    // si IdReservable n'est pas définer alors afficher une page d'erreur
    if (response.ok) {
        afficherReservationPriseEnCompte();
    }
    else if (response.status == 400) {
        document.getElementById("information_formulaire").innerHTML = "Veuillez remplir tout les champs!"
    }
    else {
        afficherErreur();
    }
}

function afficherReservationPriseEnCompte() {
    document.getElementById("formulaire_reservation").innerHTML = `
    <h1>Votre réservation à été envoyé, veuillez attendre la réponse de propriétaire.</h1>
    `
}

// afficher une erreur au client
function afficherErreur() {
    document.getElementById("body").innerHTML = `
    <main class="h-screen flex justify-center items-center">
        <div class="flex justify-center flex-wrap h-screen items-center">
            <h1 class="text-2xl w-full text-center">Nous sommes désolée, une erreur c'est produit du coté de nos server</h1>
            <img class="h-2/4" src="./img/erreur/man.png" alt="image erreur">
        </div>
    </main>`
}

async function main() {
    try {
        description_reservable.innerHTML = "";
        await afficheReservable();
    } catch (error) {
        afficherErreur();
    }
}

main();