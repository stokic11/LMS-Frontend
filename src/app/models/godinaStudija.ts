export interface GodinaStudija {
    id?: number;
    datumPocetka: Date;
    datumKraja: Date;
    studijskiProgramId: number;
    predmetiIds?: number[];
}