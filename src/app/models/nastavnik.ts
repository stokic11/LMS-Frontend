import { Korisnik } from "./korisnik";
import { Zvanje } from "./zvanje";

export interface Nastavnik extends Korisnik {
    biografija: string;
    jmbg: string;
    fakultetId?: number;
    univerzitetId?: number;
    studijskiProgramId?: number;
    nastavnikNaRealizacijiIds?: number[];
    zvanje: Zvanje;
}