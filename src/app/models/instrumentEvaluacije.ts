import { Fajl } from "./fajl";

export interface InstrumentEvaluacije {
    id?: number;
    opis: string;
    fajlovi: Fajl[];
}