import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudService } from '../generic.service';
import { Fajl } from '../../models/fajl';

@Injectable({
  providedIn: 'root'
})
export class FajlService extends CrudService<Fajl, number> {

  constructor(http: HttpClient) {
    super(http, '/api/fajlovi');
  }
}
