import { Fajl } from "./fajl";
import { Korisnik } from "./korisnik";
import { Tema } from "./tema";

export interface Objava {
    id?: number;
    vremePostavljanja: Date;
    sadrzaj: string;
    prilozi: Fajl[];
    autor: Korisnik;
    tema: Tema;
}