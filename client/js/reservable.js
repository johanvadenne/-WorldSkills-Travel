// 
// Gestion de l'affichage des listes de reservables (logemement, activité, ...)
// 


// balise qui contiendra toute la liste des logemement, activité, ...
const main_reservable = document.getElementById("main_reservable");

// récupère la liste des reservables
async function getReservables() {
    // GET -> http://127.0.0.1:8080/api/reservables
    const response = await fetch('http://127.0.0.1:8080/api/reservables');

    // Si le code http n'est pas à 200 (succèes), afficher une erreur
    if (!response.ok) {
        throw new Error('Erreur: '+response.status);
    } else {
        // convertion du json en une liste de Cl_Reservable
        const reservables = await response.json();
        var listeReservables = await reservables.map(reservable => new Cl_Reservable(
            reservable.IdReservable,
            reservable.NomReservable,
            reservable.Prix,
            reservable.Pays,
            reservable.Region,
            reservable.Ville,
            reservable.Adresse,
            reservable.IdCompteUtilisateurProprietaire,
            reservable.LienImage
        ));
    
        return listeReservables;
    }
}

// fonction qui affiche les reservable
async function afficheReservable() {
    const reservables = await getReservables();
    
    if (reservables == null) {
        return
    }
    else {
        var x = 0;
        
        // boucle qui affiche 3 réservable toute les 3 lignes
        for (const reservable of reservables) {
            
            main_reservable.innerHTML += `<a class="bg-slate-100 p-3 mb-3 hover:bg-slate-200" href="./infoReservable.html?IdReservable=${reservable.IdReservable}">
                <img class="w-full" src="./img/bdd-image/${reservable.LienImage}" alt="">

                <p class="lg:text-xl text-lg">Pays: ${reservable.Pays}</p>
                <p class="lg:text-xl text-lg">Région: ${reservable.Region}</p>
                <p class="lg:text-xl text-lg">Prix par jour: ${reservable.Prix}</p>
            </a>`;
            x++;
        }
    }
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
        main_reservable.innerHTML = "";
        await afficheReservable();
    } catch (error) {
        afficherErreur();
    }
}

main();