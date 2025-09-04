export interface Obavestenje {
    id?: number;
    vremePostavljanja: Date;
    sadrzaj: string;
    naslov: string;
    priloziIds?: number[];
    nastavnikNaRealizacijiId: number;
    realizacijaPredmetaId: number;
    obrisan?: boolean;
    datumBrisanja?: string;
}