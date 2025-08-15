export interface NastavniMaterijal {
    id?: number;
    naziv: string;
    autori: string;
    godinaIzdavanja: Date;
    ishodiIds?: number[];
    fajloviIds?: number[];
}