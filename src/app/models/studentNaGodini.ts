import { Polaganje } from "./polaganje";
import { Student } from "./student";

export interface StudentNaGodini {
    id?: number;
    datumStudija: Date;
    brojIndeksa: string;
    student: Student;
    polaganja: Polaganje[];
}