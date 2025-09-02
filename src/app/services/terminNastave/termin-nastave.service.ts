import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrudService } from '../generic.service';
import { TerminNastave } from '../../models/terminNastave';

@Injectable({
  providedIn: 'root'
})
export class TerminNastaveService extends CrudService<TerminNastave, number> {

  constructor(http: HttpClient) {
    super(http, 'http://localhost:8080/api/termini-nastave');
  }

  
  createForStudentskaSluzba(termin: any): Observable<TerminNastave> {
    return this.http.post<TerminNastave>(`http://localhost:8080/api/termini-nastave/studentska-sluzba`, termin);
  }
}
