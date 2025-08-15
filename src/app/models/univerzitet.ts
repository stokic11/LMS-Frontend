import { Adresa } from "./adresa";

export interface Univerzitet {
    id?: number;
    naziv: string;
    datumOsnivanja: Date;
    adresa: Adresa;
    rektorId: number;
    fakultetiIds?: number[];
}
