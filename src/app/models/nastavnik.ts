import { Korisnik } from "./korisnik";
import { Zvanje } from "./zvanje";

export interface Nastavnik extends Korisnik {
    ime: string;
    biografija: string;
    jmbg: string;
    fakultetId?: number;
    univerzitetId?: number;
    studijskiProgramId?: number;
    nastavnikNaRealizacijiIds?: number[];
    zvanje: Zvanje;
}