import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudService } from '../generic.service';
import { TerminNastave } from '../../models/terminNastave';

@Injectable({
  providedIn: 'root'
})
export class TerminNastaveService extends CrudService<TerminNastave, number> {

  constructor(http: HttpClient) {
    super(http, 'http://localhost:8080/api/termini-nastave');
  }
}
