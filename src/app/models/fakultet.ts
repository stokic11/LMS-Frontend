import { Adresa } from "./adresa";

export interface Fakultet {
    id?: number;
    naziv: string;
    univerzitetId: number;
    adresa: Adresa;
    dekanId?: number;
    studijskiProgramiIds?: number[];
}