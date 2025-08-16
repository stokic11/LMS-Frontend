import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WritableCrudService } from '../generic.service';
import { Nastavnik } from '../../models/nastavnik';

@Injectable({
  providedIn: 'root'
})
export class NastavnikService extends WritableCrudService<Nastavnik, number> {

  constructor(http: HttpClient) {
    super(http, '/api/nastavnici');
  }

  override getById(id: number): Observable<Nastavnik> {
    // Direktan poziv na backend za testiranje
    const backendUrl = `http://localhost:8080/api/nastavnici/${id}`;
    console.log('Pozivam direktno backend URL za nastavnika:', backendUrl);
    return this.http.get<Nastavnik>(backendUrl);
  }
}
