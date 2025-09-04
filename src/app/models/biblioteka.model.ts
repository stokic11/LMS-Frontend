export interface Biblioteka {
  id?: number;
  knjigaId: number;
  brojPrimeraka: number;
  knjiga?: {
    id: number;
    naziv: string;
    autor: string;
  };
}
