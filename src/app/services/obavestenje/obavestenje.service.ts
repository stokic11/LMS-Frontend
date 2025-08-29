import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrudService } from '../generic.service';
import { Obavestenje } from '../../models/obavestenje';

@Injectable({
  providedIn: 'root'
})
export class ObavestenjeService extends CrudService<Obavestenje, number> {

  constructor(http: HttpClient) {
    super(http, '/api/obavestenja');
  }

  getByStudentId(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/obavestenja/student/${studentId}`);
  }

  override getById(id: number): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/api/obavestenja/${id}`);
  }
}
