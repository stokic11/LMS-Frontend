import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipPotvrde } from '../../models/potvrda';

@Injectable({
  providedIn: 'root'
})
export class TipPotvrdaService {
  private baseUrl = 'http://localhost:8080/api/tipovi-potvrda';

  constructor(private http: HttpClient) {}

  getAllTipovi(): Observable<TipPotvrde[]> {
    return this.http.get<TipPotvrde[]>(this.baseUrl);
  }

  getTipById(id: number): Observable<TipPotvrde> {
    return this.http.get<TipPotvrde>(`${this.baseUrl}/${id}`);
  }

  createTip(tip: Omit<TipPotvrde, 'id'>): Observable<TipPotvrde> {
    return this.http.post<TipPotvrde>(this.baseUrl, tip);
  }

  updateTip(id: number, tip: Omit<TipPotvrde, 'id'>): Observable<TipPotvrde> {
    return this.http.put<TipPotvrde>(`${this.baseUrl}/${id}`, tip);
  }

  deleteTip(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
