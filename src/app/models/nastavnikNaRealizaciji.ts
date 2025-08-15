import { TipNastave } from "./tipNastave";

export interface NastavnikNaRealizaciji {
    id?: number;
    brojCasova: number;
    realizacijaPredmetaId: number;
    tipNastave: TipNastave;
    nastavnikId: number;
}