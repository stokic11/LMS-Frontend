import { Fajl } from "./fajl";
import { Ishod } from "./ishod";

export interface NastavniMaterijal {
    id?: number;
    naziv: string;
    autori: string;
    godinaIzdavanja: Date;
    ishodi: Ishod[];
    fajlovi: Fajl[];
}