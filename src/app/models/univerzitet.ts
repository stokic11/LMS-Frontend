import { Adresa } from "./adresa";
import { Nastavnik } from "./nastavnik";

export interface Univerzitet {
    id?: number;
    naziv: string;
    datumOsnivanja: Date;
    adresa: Adresa;
    rektor: Nastavnik
}
