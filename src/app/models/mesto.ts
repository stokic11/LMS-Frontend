import { Drzava } from "./drzava";

export interface Mesto {
    id?: number;
    naziv: string;
    drzava: Drzava;
}