import { InstrumentEvaluacije } from "./instrumentEvaluacije";
import { Ishod } from "./ishod";
import { TipEvaluacije } from "./tipEvaluacije";

export interface EvaluacijaZnanja {
    id?: number;
    vremePocetka: Date;
    vremeZavrsetka: Date;
    bodovi: number;
    tipEvaluacije: TipEvaluacije;
    ishod: Ishod;
    instrumentEvaluacije: InstrumentEvaluacije[];
}