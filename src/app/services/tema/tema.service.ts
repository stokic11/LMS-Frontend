import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudService } from '../generic.service';
import { Tema } from '../../models/tema';

@Injectable({
  providedIn: 'root'
})
export class TemaService extends CrudService<Tema, number> {

  constructor(http: HttpClient) {
    super(http, '/api/teme');
  }
}
