import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudService } from '../generic.service';
import { Poruka } from '../../models/poruka';

@Injectable({
  providedIn: 'root'
})
export class PorukaService extends CrudService<Poruka, number> {

  constructor(http: HttpClient) {
    super(http, '/api/poruka');
  }
}
