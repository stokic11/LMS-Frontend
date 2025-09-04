import { Ishod } from "./ishod";
import { TipEvaluacije } from "./tipEvaluacije";

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