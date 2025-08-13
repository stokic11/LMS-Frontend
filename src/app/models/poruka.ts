import { Fajl } from "./fajl";
import { Korisnik } from "./korisnik";

export interface Poruka {
    id?: number;
    datumPostavljanja: Date;
    sadrzaj: string;
    prilozi: Fajl[];
    primalac: Korisnik[];
    posiljalac: Korisnik;
}