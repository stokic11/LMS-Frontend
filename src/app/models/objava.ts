export interface Objava {
    id?: number;
    vremeObjave: Date;
    sadrzaj: string;
    priloziIds?: number[];
    autorId: number;
    temaId: number;
}