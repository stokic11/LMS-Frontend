import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Potvrda } from '../../models/potvrda';

@Injectable({
  providedIn: 'root'
})
export class PotvrdaService {
  private apiUrl = 'http://localhost:8080/api/potvrde';

  constructor(private http: HttpClient) { }

  getAllPotvrde(): Observable<Potvrda[]> {
    return this.http.get<Potvrda[]>(this.apiUrl);
  }

  getPendingPotvrde(): Observable<Potvrda[]> {
    return this.http.get<Potvrda[]>(`${this.apiUrl}/pending`);
  }

  getApprovedPotvrde(): Observable<Potvrda[]> {
    return this.http.get<Potvrda[]>(`${this.apiUrl}/approved`);
  }

  getPotvrdaByStudentId(studentId: number): Observable<Potvrda[]> {
    return this.http.get<Potvrda[]>(`${this.apiUrl}/student/${studentId}`);
  }

  getApprovedPotvrdaByStudentId(studentId: number): Observable<Potvrda[]> {
    return this.http.get<Potvrda[]>(`${this.apiUrl}/student/${studentId}/approved`);
  }

  createPotvrda(studentId: number, tipPotvrdaId: number): Observable<Potvrda> {
    return this.http.post<Potvrda>(`${this.apiUrl}/create`, { studentId, tipPotvrdaId });
  }

  approvePotvrda(id: number): Observable<Potvrda> {
    return this.http.put<Potvrda>(`${this.apiUrl}/${id}/approve`, {});
  }

  getPotvrdaById(id: number): Observable<Potvrda> {
    return this.http.get<Potvrda>(`${this.apiUrl}/${id}`);
  }

  deletePotvrda(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
