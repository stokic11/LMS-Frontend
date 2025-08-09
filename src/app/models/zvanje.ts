import { NaucnaOblast } from "./naucnaOblast";
import { TipZvanja } from "./tipZvanja";

export interface Zvanje {
    id?: number;
    datumIzbora: Date;
    datumPrestanka: Date;
    tipZvanja: TipZvanja;
    naucnaOblast: NaucnaOblast
}