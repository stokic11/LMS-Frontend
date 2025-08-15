import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReadOnlyCrudService } from '../generic.service';
import { TipEvaluacije } from '../../models/tipEvaluacije';

@Injectable({
  providedIn: 'root'
})
export class TipEvaluacijeService extends ReadOnlyCrudService<TipEvaluacije, number> {

  constructor(http: HttpClient) {
    super(http, '/api/tipovi-evaluacije');
  }
}
