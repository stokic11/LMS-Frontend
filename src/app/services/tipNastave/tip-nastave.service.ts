import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReadOnlyCrudService } from '../generic.service';
import { TipNastave } from '../../models/tipNastave';

@Injectable({
  providedIn: 'root'
})
export class TipNastaveService extends ReadOnlyCrudService<TipNastave, number> {

  constructor(http: HttpClient) {
    super(http, 'http://localhost:8080/api/tipovi-nastave');
  }
}
