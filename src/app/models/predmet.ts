import { Ishod } from "./ishod";

export interface Predmet { 
    id?: number;
    naziv: string;
    espb: number;
    obavezan: boolean;
    brojPredavanja: number;
    brojVezbi: number;
    drugiObliciNastave: number;
    istrazivackiRad: number;
    ostaliCasovi: number;
    brojSemestra: number;
    silabus: Ishod[];
    godinaStudijaId: number;
    realizacijePredmetaIds?: number[];
    predusloviIds?: number[];
    zavisniPredmetiIds?: number[];
}