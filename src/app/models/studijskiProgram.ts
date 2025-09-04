export interface StudijskiProgram {
    id?: number;
    naziv: string;
    godineStudijaIds: number[];
    rukovodilaId: number;
    fakultetId: number;
    obrisan?: boolean;
    datumBrisanja?: string;
}