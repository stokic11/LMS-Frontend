import { RealizacijaPredmeta } from "./realizacijaPredmeta";
import { Student } from "./student";

export interface PohadjanjePredmeta {
    id?: number;
    konacnaOcena: number;
    datumPohadjanja: Date;
    realizacijaPredmeta: RealizacijaPredmeta;
    student: Student;
}