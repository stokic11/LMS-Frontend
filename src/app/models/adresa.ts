import { Mesto } from "./mesto";

export interface Adresa {
    id?: number;
    ulica: string;
    broj: string;
    mesto: Mesto;
  }