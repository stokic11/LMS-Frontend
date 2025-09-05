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
    let backendUrl = `http://localhost:8080/api/fakulteti/${id}/info`;
    return this.http.get<any>(backendUrl);
  }

  override getById(id: number): Observable<Fakultet> {
    let backendUrl = `http://localhost:8080/api/fakulteti/${id}`;
    return this.http.get<Fakultet>(backendUrl);
  }
}
