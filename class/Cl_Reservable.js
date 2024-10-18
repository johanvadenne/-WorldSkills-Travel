// un reservable peu être un logement, une activité culturel ou autre évènement qui peu être réservé
class Cl_Reservable {
    constructor(IdReservable, NomReservable, Prix, Pays, Region, Ville, Adresse, IdCompteUtilisateurProprietaire, LienImage) {
        this.IdReservable = IdReservable;
        this.NomReservable = NomReservable; 
        this.Prix = Prix;
        this.Pays = Pays;
        this.Region = Region;
        this.Ville = Ville;
        this.Adresse = Adresse;
        this.IdCompteUtilisateurProprietaire = IdCompteUtilisateurProprietaire;
        this.LienImage = LienImage;
    }
}