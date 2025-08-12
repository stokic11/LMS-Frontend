import { EvaluacijaZnanja } from "./evaluacijaZnanja";
import { StudentNaGodini } from "./studentNaGodini";

export interface Polaganje {
    id?: number;
    bodovi: number;
    napomena: string;
    evaluacijaZnanja: EvaluacijaZnanja;
    studentNaGodini: StudentNaGodini;
}