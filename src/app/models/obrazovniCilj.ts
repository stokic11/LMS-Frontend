import { Ishod } from "./ishod";

export interface ObrazovniCilj {
    id?: number;
    opis: string;
    ishodi: Ishod[];
}