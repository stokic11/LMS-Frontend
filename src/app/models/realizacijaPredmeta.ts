import { EvaluacijaZnanja } from "./evaluacijaZnanja";
import { PohadjanjePredmeta } from "./pohadjanjePredmeta";
import { Predmet } from "./predmet";
import { TerminNastave } from "./terminNastave";

export interface RealizacijaPredmeta {
    id?: number;
    pohadjanja: PohadjanjePredmeta[];
    predmet: Predmet;
    terminiNastave: TerminNastave[];
    evaluacijeZnanja: EvaluacijaZnanja[];
}