import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipPotvrde } from '../../models/potvrda';

@Injectable({
  providedIn: 'root'
})
export class TipPotvrdaService {
  private apiUrl = 'http://localhost:8080/api/tipovi-potvrda';

  constructor(private http: HttpClient) { }

  getAllTipovePotvrda(): Observable<TipPotvrde[]> {
    return this.http.get<TipPotvrde[]>(this.apiUrl);
  }

  getTipPotvrdaById(id: number): Observable<TipPotvrde> {
    return this.http.get<TipPotvrde>(`${this.apiUrl}/${id}`);
  }

  createTipPotvrda(naziv: string): Observable<TipPotvrde> {
    return this.http.post<TipPotvrde>(this.apiUrl, { naziv });
  }

  updateTipPotvrda(id: number, naziv: string): Observable<TipPotvrde> {
    return this.http.put<TipPotvrde>(`${this.apiUrl}/${id}`, { naziv });
  }

  deleteTipPotvrda(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
