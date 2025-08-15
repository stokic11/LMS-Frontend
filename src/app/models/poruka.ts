export interface Poruka {
    id?: number;
    datumPohadjanja: Date;
    sadrzaj: string;
    priloziIds?: number[];
    primalacId: number;
    posiljalacId: number;
}