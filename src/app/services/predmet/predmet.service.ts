import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudService } from '../generic.service';
import { Predmet } from '../../models/predmet';

@Injectable({
  providedIn: 'root'
})
export class PredmetService extends CrudService<Predmet, number> {

  constructor(http: HttpClient) {
    super(http, '/api/predmet');
  }
}
