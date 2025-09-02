import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrudService } from '../generic.service';
import { EvaluacijaZnanja } from '../../models/evaluacijaZnanja';

@Injectable({
  providedIn: 'root'
})
export class EvaluacijaZnanjaService extends CrudService<EvaluacijaZnanja, number> {

  constructor(http: HttpClient) {
    super(http, 'http://localhost:8080/api/evaluacije-znanja');
  }

  getDostupneIspiteZaStudenta(studentId: number): Observable<EvaluacijaZnanja[]> {
    return this.http.get<EvaluacijaZnanja[]>(`http://localhost:8080/api/evaluacije-znanja/student/${studentId}/dostupni-ispiti`);
  }

  getByNastavnikId(nastavnikId: number): Observable<EvaluacijaZnanja[]> {
    return this.http.get<EvaluacijaZnanja[]>(`http://localhost:8080/api/evaluacije-znanja/nastavnik/${nastavnikId}`);
  }


  getAllForStudentskaSluzba(): Observable<EvaluacijaZnanja[]> {
    return this.http.get<EvaluacijaZnanja[]>(`http://localhost:8080/api/evaluacije-znanja/studentska-sluzba`);
  }

 
  getAllEvaluacije(): Observable<EvaluacijaZnanja[]> {
    return this.http.get<EvaluacijaZnanja[]>(`http://localhost:8080/api/evaluacije-znanja/all`);
  }


  createForStudentskaSluzba(evaluacija: any): Observable<EvaluacijaZnanja> {
    return this.http.post<EvaluacijaZnanja>(`http://localhost:8080/api/evaluacije-znanja/studentska-sluzba`, evaluacija);
  }
}
