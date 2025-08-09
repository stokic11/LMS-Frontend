import { Korisnik } from "./korisnik";

export interface Nastavnik extends Korisnik {
    ime: string;
    biografija: string;
    jmbg: string;
    zvanje: string; 

}