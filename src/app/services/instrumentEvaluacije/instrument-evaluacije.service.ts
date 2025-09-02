import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrudService } from '../generic.service';
import { InstrumentEvaluacije } from '../../models/instrumentEvaluacije';

@Injectable({
  providedIn: 'root'
})
export class InstrumentEvaluacijeService extends CrudService<InstrumentEvaluacije, number> {

  constructor(http: HttpClient) {
    super(http, 'http://localhost:8080/api/instrumenti-evaluacije');
  }

  getByNastavnikId(nastavnikId: number): Observable<InstrumentEvaluacije[]> {
    return this.http.get<InstrumentEvaluacije[]>(`${this.baseUrl}/nastavnik/${nastavnikId}`);
  }
}
