import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CrudService } from '../generic.service';
import { NastavniMaterijal } from '../../models/nastavniMaterijal';

@Injectable({
  providedIn: 'root'
})
export class NastavniMaterijalService extends CrudService<NastavniMaterijal, number> {

  constructor(http: HttpClient) {
    super(http, '/api/nastavni-materijali');
  }

  getByPredmetId(predmetId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/nastavni-materijali/predmeti/${predmetId}`);
  }
}
