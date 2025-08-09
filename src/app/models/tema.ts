import { Forum } from "./forum";
import { Korisnik } from "./korisnik";
import { Objava } from "./objava";

export interface Tema {
    id?: number;
    naziv: string;
    forum: Forum;
    autor: Korisnik;
    objave: Objava[];
}