export interface Korisnik {
    id?: number;
    korisnickoIme: string;
    lozinka?: string;
    email: string;
    ime?: string;
    prezime?: string;
    ulogaId?: number; 
    uloga?: string;
    forumiIds?: number[]; 
    datumRodjenja?: Date;
}