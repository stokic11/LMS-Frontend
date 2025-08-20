export interface Korisnik {
    id?: number;
    korisnickoIme: string;
    lozinka?: string;
    email: string;
    ime?: string;
    prezime?: string;
    ulogaId?: number; 
    forumiIds?: number[]; 
    datumRodjenja?: Date;
}