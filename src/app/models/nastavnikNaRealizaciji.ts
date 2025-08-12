import { Nastavnik } from "./nastavnik";
import { RealizacijaPredmeta } from "./realizacijaPredmeta";
import { TipNastave } from "./tipNastave";

export interface NastavnikNaRealizaciji {
    id?: number;
    brojCasova: number;
    realizacijaPredmeta: RealizacijaPredmeta;
    tipNastave: TipNastave;
    nastavnik: Nastavnik;
}