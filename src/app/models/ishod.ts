import { ObrazovniCilj } from "./obrazovniCilj";

export interface Ishod {
    id?: number;
    opis: string;
    predmetId: number;
    obrazovniCilj: ObrazovniCilj;
}