import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WritableCrudService } from '../generic.service';
import { Polaganje } from '../../models/polaganje';

@Injectable({
  providedIn: 'root'
})
export class PolaganjeService extends WritableCrudService<Polaganje, number> {

  constructor(http: HttpClient) {
    super(http, '/api/polaganja');
  }

  getIstorijaStudiranja(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/polaganja/student/${studentId}/istorija`);
  }

  prijaviIspit(studentId: number, evaluacijaZnanjaId: number): Observable<Polaganje> {
    return this.http.post<Polaganje>(`http://localhost:8080/api/polaganja/student/${studentId}/prijavi-ispit/${evaluacijaZnanjaId}`, {});
  }

  getPrijavljenaPolaganja(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/polaganja/student/${studentId}/prijavljeni-ispiti`);
  }

  getPrijavljeneIspiteZaNastavnika(nastavnikId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/polaganja/nastavnik/${nastavnikId}/prijavljeni-ispiti`);
  }

  getOcenjeneIspiteZaNastavnika(nastavnikId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/polaganja/nastavnik/${nastavnikId}/ocenjeni-ispiti`);
  }

  oceniStudenta(polaganjeId: number, bodovi: number, napomena: string): Observable<Polaganje> {
    return this.http.put<Polaganje>(`http://localhost:8080/api/polaganja/${polaganjeId}/oceni`, {
      bodovi: bodovi,
      napomena: napomena
    });
  }
}
