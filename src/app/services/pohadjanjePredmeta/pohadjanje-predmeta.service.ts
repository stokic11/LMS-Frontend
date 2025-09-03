import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrudService } from '../generic.service';
import { PohadjanjePredmeta } from '../../models/pohadjanjePredmeta';

@Injectable({
  providedIn: 'root'
})
export class PohadjanjePredmetaService extends CrudService<PohadjanjePredmeta, number> {

  constructor(http: HttpClient) {
    super(http, '/api/pohadjanje-predmeta');
  }

  getByStudentId(studentId: number): Observable<PohadjanjePredmeta[]> {
    return this.http.get<PohadjanjePredmeta[]>(`http://localhost:8080/api/pohadjanje-predmeta/student/${studentId}`);
  }

  getStudentsByPredmetId(predmetId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/pohadjanje-predmeta/predmet/${predmetId}/studenti`);
  }
}
