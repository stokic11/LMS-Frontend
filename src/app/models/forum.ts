import { Tema } from "./tema";

export interface Forum {
    id?: number;
    javni: boolean;
    teme: Tema[];
}