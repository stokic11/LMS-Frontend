import { Adresa } from "./adresa";
import { Univerzitet } from "./univerzitet";

export interface Fakultet {
    id?: number;
    naziv: string;
    adresa: Adresa;
    univerzitet: Univerzitet;

}