import { Fajl } from "./fajl";
import { Korisnik } from "./korisnik";

export interface Objava {
    id?: number;
    vremePostavljanja: Date;
    sadrzaj: string;
    prilozi: Fajl[];
    autor: Korisnik;
    tema: Tema;
}