GRANT SELECT ON TABLE public."T_TypeReservable" TO "WorldSkillsTravel";
GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE public."T_Reservation" TO "WorldSkillsTravel";
GRANT SELECT ON TABLE public."T_Reservable" TO "WorldSkillsTravel";
GRANT SELECT, INSERT ON TABLE public."T_CompteUtilisateur" TO "WorldSkillsTravel";
GRANT SELECT ON TABLE public."T_AssoReservableType" TO "WorldSkillsTravel";
GRANT INSERT ON SEQUENCE public."T_CompteUtilisateur_IdCompteUtilisateur_seq" TO "WorldSkillsTravel";
GRANT ALL ON SEQUENCE public."T_Reservation_IdReservation_seq" TO "WorldSkillsTravel";