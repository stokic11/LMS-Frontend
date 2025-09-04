import { Ishod } from "./ishod";
import { TipNastave } from "./tipNastave";

export interface TerminNastave {
    id?: number;
    vremePocetka: string;
    vremeZavrsetka: string;
    ishod: Ishod;
    realizacijaPredmetaId: number;
    tipNastave: TipNastave;
    obrisan?: boolean;
    datumBrisanja?: string;
}