export interface IzdataKnjiga {
  id?: number;
  studentId: number;
  knjigaId: number;
  odobreno: boolean;
  student?: {
    id: number;
    korisnik?: {
      ime: string;
      prezime: string;
      email: string;
    };
  };
  knjiga?: {
    id: number;
    naziv: string;
    autor: string;
  };
}
