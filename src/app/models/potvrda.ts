export interface Potvrda {
  id?: number;
  datumIzdanja: Date;
  odobreno: boolean;
  studentId?: number;
  studentIme?: string;
  studentPrezime?: string;
  studentKorisnickoIme?: string;
  tipPotvrdaId?: number;
  tipPotvrdaNaziv?: string;
}

export interface TipPotvrde {
  id?: number;
  naziv: string;
}
