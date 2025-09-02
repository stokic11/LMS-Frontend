import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudService } from '../generic.service';
import { RealizacijaPredmeta } from '../../models/realizacijaPredmeta';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RealizacijaPredmetaService extends CrudService<RealizacijaPredmeta, number> {

  constructor(http: HttpClient) {
    super(http, 'http://localhost:8080/api/realizacije-predmeta');
  }

  getByNastavnikId(nastavnikId: number): Observable<RealizacijaPredmeta[]> {
    return this.http.get<RealizacijaPredmeta[]>(`http://localhost:8080/api/realizacije-predmeta/nastavnik/${nastavnikId}`);
  }
}
