import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReadOnlyCrudService } from '../generic.service';
import { Fakultet } from '../../models/fakultet';

@Injectable({
  providedIn: 'root'
})
export class FakultetService extends ReadOnlyCrudService<Fakultet, number> {

  constructor(http: HttpClient) {
    super(http, '/api/fakulteti');
  }

  getFakultetInfo(id: number): Observable<any> {
    // Direktan poziv na backend za testiranje
    const backendUrl = `http://localhost:8080/api/fakulteti/${id}/info`;
    console.log('Pozivam direktno backend URL:', backendUrl);
    return this.http.get<any>(backendUrl);
  }

  // Override getById da koristi direktan backend poziv
  override getById(id: number): Observable<Fakultet> {
    const backendUrl = `http://localhost:8080/api/fakulteti/${id}`;
    console.log('Pozivam direktno backend URL za punu informaciju:', backendUrl);
    return this.http.get<Fakultet>(backendUrl);
  }
}
