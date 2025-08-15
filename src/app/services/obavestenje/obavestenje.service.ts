import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudService } from '../generic.service';
import { Obavestenje } from '../../models/obavestenje';

@Injectable({
  providedIn: 'root'
})
export class ObavestenjeService extends CrudService<Obavestenje, number> {

  constructor(http: HttpClient) {
    super(http, '/api/obavestenje');
  }
}
