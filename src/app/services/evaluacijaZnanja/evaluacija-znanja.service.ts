import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudService } from '../generic.service';
import { EvaluacijaZnanja } from '../../models/evaluacijaZnanja';

@Injectable({
  providedIn: 'root'
})
export class EvaluacijaZnanjaService extends CrudService<EvaluacijaZnanja, number> {

  constructor(http: HttpClient) {
    super(http, '/api/evaluacije-znanja');
  }
}
