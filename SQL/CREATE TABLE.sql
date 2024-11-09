CREATE TABLE public."T_TypeReservable"(
   "IdTypeReservable" SERIAL,
   "TypeReservable" VARCHAR(50)  NOT NULL,
   PRIMARY KEY("IdTypeReservable")
);

CREATE TABLE public."T_CompteUtilisateur"(
   "IdCompteUtilisateur" SERIAL,
   "Nom" VARCHAR(50)  NOT NULL,
   "Mail" VARCHAR(256)  NOT NULL,
   "MotDePasse" VARCHAR(256)  NOT NULL,
   PRIMARY KEY("IdCompteUtilisateur")
);

CREATE TABLE public."T_Echange"(
   "IdEchange" SERIAL,
   Message VARCHAR(1000)  NOT NULL,
   "DateMessage" TIMESTAMP NOT NULL,
   "IdCompteUtilisateurProprietaire" INTEGER NOT NULL,
   "IdCompteUtilisateurDestinataire" INTEGER NOT NULL,
   PRIMARY KEY("IdEchange"),
   FOREIGN KEY("IdCompteUtilisateurProprietaire") REFERENCES public."T_CompteUtilisateur"("IdCompteUtilisateur"),
   FOREIGN KEY("IdCompteUtilisateurDestinataire") REFERENCES public."T_CompteUtilisateur"("IdCompteUtilisateur")
);

CREATE TABLE public."T_Reservable"(
   "IdReservable" SERIAL,
   "NomReservable" VARCHAR(50)  NOT NULL,
   "Prix" NUMERIC(15,2)   NOT NULL,
   "Pays" VARCHAR(50)  NOT NULL,
   "Region" VARCHAR(50)  NOT NULL,
   "Ville" VARCHAR(50)  NOT NULL,
   "Adresse" VARCHAR(256)  NOT NULL,
   "LienImage" VARCHAR(256)  NOT NULL,
   "IdCompteUtilisateurProprietaire" INTEGER NOT NULL,
   PRIMARY KEY("IdReservable"),
   FOREIGN KEY("IdCompteUtilisateurProprietaire") REFERENCES public."T_CompteUtilisateur"("IdCompteUtilisateur")
);

CREATE TABLE public."T_Reservation"(
   "IdReservation" SERIAL,
   "DateDebutReservation" DATE NOT NULL,
   "DateFinReservation" DATE NOT NULL,
   "IdCompteUtilisateur" INTEGER NOT NULL,
   "IdReservable" INTEGER NOT NULL,
   "LienImage" VARCHAR(256) NOT NULL,
   PRIMARY KEY("IdReservation"),
   FOREIGN KEY("IdCompteUtilisateur") REFERENCES "T_CompteUtilisateur"("IdCompteUtilisateur"),
   FOREIGN KEY("IdReservable") REFERENCES public."T_Reservable"("IdReservable")
);


CREATE TABLE public."T_AssoReservableType"(
   "IdReservable" INTEGER,
   "IdTypeReservable" INTEGER,
   PRIMARY KEY("IdReservable", "IdTypeReservable"),
   FOREIGN KEY("IdReservable") REFERENCES public."T_Reservable"("IdReservable"),
   FOREIGN KEY("IdTypeReservable") REFERENCES public."T_TypeReservable"("IdTypeReservable")
);