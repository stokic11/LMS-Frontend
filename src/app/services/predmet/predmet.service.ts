import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrudService } from '../generic.service';
import { Predmet } from '../../models/predmet';

@Injectable({
  providedIn: 'root'
})
export class PredmetService extends CrudService<Predmet, number> {

  constructor(http: HttpClient) {
    super(http, '/api/predmeti');
  }

  override getById(id: number): Observable<Predmet> {
    const backendUrl = `http://localhost:8080/api/predmeti/${id}`;
    console.log('Pozivam backend URL za predmet:', backendUrl);
    return this.http.get<Predmet>(backendUrl);
  }

  override getAll(): Observable<Predmet[]> {
    const backendUrl = `http://localhost:8080/api/predmeti`;
    console.log('Pozivam backend URL za sve predmete:', backendUrl);
    return this.http.get<Predmet[]>(backendUrl);
  }
}
