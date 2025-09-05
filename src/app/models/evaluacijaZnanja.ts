import { Ishod } from "./ishod";
import { TipEvaluacije } from "./tipEvaluacije";
import { Student } from "./student";
import { Predmet } from "./predmet";

export interface EvaluacijaZnanja {
    id?: number;
    vremePocetka: Date;
    vremeZavrsetka: Date;
    bodovi: number;
    tipEvaluacije: TipEvaluacije;
    realizacijaPredmetaId: number;
    ishod?: Ishod;
    instrumentiEvaluacijeIds?: number[];
    obrisan?: boolean;
    datumBrisanja?: string;
}

export interface OcenjivanjeData {
    student: Student;
    brojIndeksa: string;
    predmet: Predmet;
    tipEvaluacije: TipEvaluacije;
    trenutniBodovi: number;
    trenutnaNapomena: string;
}