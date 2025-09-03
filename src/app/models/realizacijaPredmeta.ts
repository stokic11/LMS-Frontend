export interface RealizacijaPredmeta {
    id?: number;
    nastavniciIds?: number[];
    pohadjanjaPredmetaIds?: number[];
    predmetId: number;
    predmet?: {
        id: number;
        naziv: string;
    };
    terminiNastaveIds?: number[];
    evaluacijeZnanjaIds?: number[];
}