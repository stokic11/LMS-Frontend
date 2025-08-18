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
    const backendUrl = `http://localhost:8080/api/univerziteti/${id}/info`;
    console.log('Pozivam direktno backend URL:', backendUrl);
    return this.http.get<any>(backendUrl);
  }

  override getById(id: number): Observable<Univerzitet> {
    const backendUrl = `http://localhost:8080/api/univerziteti/${id}`;
    console.log('Pozivam direktno backend URL za punu informaciju:', backendUrl);
    return this.http.get<Univerzitet>(backendUrl);
  }
}
