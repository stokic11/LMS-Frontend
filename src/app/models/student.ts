import { Korisnik } from "./korisnik";
import { Adresa } from './adresa';

export interface Student extends Korisnik {
    ime: string;
    jmbg: string;
    adresa: Adresa;
    studentNaGodiniIds?: number[];
    pohadjanjaPredmetaIds?: number[];
}