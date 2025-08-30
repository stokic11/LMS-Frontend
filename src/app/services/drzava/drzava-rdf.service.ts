import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Drzava } from '../../models/drzava';
import { AppConstants } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class DrzavaRdfService {
  private apiUrl = AppConstants.buildUrl('rdf/drzave');

  constructor(private http: HttpClient) {}

  getAllDrzave(): Observable<Drzava[]> {
    return this.http.get<Drzava[]>(this.apiUrl);
  }

  getDrzavaById(id: number): Observable<Drzava> {
    return this.http.get<Drzava>(`${this.apiUrl}/${id}`);
  }

  createDrzava(drzava: Drzava): Observable<Drzava> {
    return this.http.post<Drzava>(this.apiUrl, drzava);
  }

  updateDrzava(id: number, drzava: Drzava): Observable<Drzava> {
    return this.http.put<Drzava>(`${this.apiUrl}/${id}`, drzava);
  }

  deleteDrzava(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchDrzaveByNaziv(naziv: string): Observable<Drzava[]> {
    return this.http.get<Drzava[]>(`${this.apiUrl}/search`, { params: { naziv } });
  }
}
