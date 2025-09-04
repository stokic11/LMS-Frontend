import { EvaluacijaZnanja } from "./evaluacijaZnanja";

export interface InstrumentEvaluacije {
    id?: number;
    opis: string;
    evaluacijaZnanja?: EvaluacijaZnanja;
    evaluacijaZnanjaId: number;
    fajloviIds?: number[];
    obrisan?: boolean;
    datumBrisanja?: string;
}