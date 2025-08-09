import { PohadjanjePredmeta } from './pohadjanjePredmeta';
import { Korisnik } from "./korisnik";
import { Adresa } from './adresa';

export interface Student extends Korisnik {
    ime: string;
    jmbg: string;
    adresa: Adresa;
    studentNaGodini: StudentNaGodini[];
    pohadjanjaPredmeta: PohadjanjePredmeta[];

}