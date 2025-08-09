import { Nastavnik } from "./nastavnik";
import { RealizacijaPredmeta } from "./realizacijaPredmeta";

export interface NastavnikNaRealizaciji {
    id?: number;
    brojCasova: number;
    realizacijaPredmeta: RealizacijaPredmeta;
    tipNastave: TipNastave;
    nastavnik: Nastavnik;
}