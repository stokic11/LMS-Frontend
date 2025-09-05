import { Korisnik } from "./korisnik";
import { Adresa } from './adresa';

export interface Student extends Korisnik {
    jmbg: string;
    adresa: Adresa;
    studentNaGodiniIds?: number[];
    pohadjanjaPredmetaIds?: number[];
    
    brojIndeksa?: string;
    godinaUpisa?: number;
    prosecnaOcena?: string;
    konacnaOcena?: string;
}