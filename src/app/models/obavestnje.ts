import { Fajl } from "./fajl";
import { Nastavnik } from "./nastavnik";

export interface Obavestenje {
    id?: number;
    vremePostavljanja: Date;
    sadrzaj: string;
    naslov: string;
    prilozi: Fajl[];
    nastavnik: NastavnikNaRealizaciji;
    predmet: Predmet;
}