import { Fakultet } from "./fakultet";
import { GodinaStudija } from "./godinaStudija";
import { Nastavnik } from "./nastavnik";

export interface StudijskiProgram {
    id?: number;
    naziv: string;
    godineStudija: GodinaStudija[];
    rukovodilac: Nastavnik;
    fakultet: Fakultet;

}