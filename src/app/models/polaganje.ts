import { EvaluacijaZnanja } from "./evaluacijaZnanja";

export interface Polaganje {
    id?: number;
    bodovi: number;
    napomena: string;
    evaluacijaZnanja: EvaluacijaZnanja;
    studentNaGodini: StudentNaGodini;
}