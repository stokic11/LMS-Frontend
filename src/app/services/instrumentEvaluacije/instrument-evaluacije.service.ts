import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudService } from '../generic.service';
import { InstrumentEvaluacije } from '../../models/instrumentEvaluacije';

@Injectable({
  providedIn: 'root'
})
export class InstrumentEvaluacijeService extends CrudService<InstrumentEvaluacije, number> {

  constructor(http: HttpClient) {
    super(http, '/api/instrumentEvaluacije');
  }
}
