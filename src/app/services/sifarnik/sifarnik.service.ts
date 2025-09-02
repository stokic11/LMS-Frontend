import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sifarnik } from '../../models/sifarnik';
import { CrudService } from '../generic.service';

@Injectable({
  providedIn: 'root'
})
export class SifarnikService extends CrudService<Sifarnik> {

  constructor(http: HttpClient) {
    super(http, 'http://localhost:8080/api/sifarnik');
  }

  override getById(id: number): Observable<Sifarnik> {
      const backendUrl = `http://localhost:8080/api/sifarnik/${id}`;
      return this.http.get<Sifarnik>(backendUrl);
    }
  
    getSifarnik(sifarnikId: number): Observable<any[]> {
      const backendUrl = `http://localhost:8080/api/sifarnik/${sifarnikId}`;
      return this.http.get<any[]>(backendUrl);
    }
}
