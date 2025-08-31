import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrudService } from '../generic.service';
import { Ishod } from '../../models/ishod';

@Injectable({
  providedIn: 'root'
})
export class IshodService extends CrudService<Ishod, number> {

  constructor(http: HttpClient) {
    super(http, 'http://localhost:8080/api/ishodi');
  }

  getByPredmetId(predmetId: number): Observable<Ishod[]> {
    return this.http.get<Ishod[]>(`http://localhost:8080/api/ishodi/predmet/${predmetId}`);
  }
}
