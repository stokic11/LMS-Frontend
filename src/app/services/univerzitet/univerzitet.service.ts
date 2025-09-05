import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReadOnlyCrudService } from '../generic.service';
import { Univerzitet } from '../../models/univerzitet';

@Injectable({
  providedIn: 'root'
})
export class UniverzitetService extends ReadOnlyCrudService<Univerzitet, number> {

  constructor(http: HttpClient) {
    super(http, '/api/univerziteti');
  }

  getUniverzitetInfo(id: number): Observable<any> {
    let backendUrl = `http://localhost:8080/api/univerziteti/${id}/info`;
    return this.http.get<any>(backendUrl);
  }

  override getById(id: number): Observable<Univerzitet> {
    let backendUrl = `http://localhost:8080/api/univerziteti/${id}`;
    return this.http.get<Univerzitet>(backendUrl);
  }
}
