import { Ishod } from "./ishod";
import { TipNastave } from "./tipNastave";

export interface TerminNastave {
    id?: number;
    vremePocetka: Date;
    vremeZavrsetka: Date;
    ishod: Ishod;
    realizacijaPredmetaId: number;
    tipNastave: TipNastave;
}