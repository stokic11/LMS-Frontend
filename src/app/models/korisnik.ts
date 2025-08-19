import { Uloga } from "./uloga";

export interface Korisnik {
    id?: number;
    korisnickoIme: string;
    lozinka: string;
    email: string;
    ime?: string;
    prezime?: string;
    uloga: Uloga;
}