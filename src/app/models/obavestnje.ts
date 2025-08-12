import { Fajl } from "./fajl";
import { NastavnikNaRealizaciji } from "./nastavnikNaRealizaciji";
import { Predmet } from "./predmet";

export interface Obavestenje {
    id?: number;
    vremePostavljanja: Date;
    sadrzaj: string;
    naslov: string;
    prilozi: Fajl[];
    nastavnik: NastavnikNaRealizaciji;
    predmet: Predmet;
}