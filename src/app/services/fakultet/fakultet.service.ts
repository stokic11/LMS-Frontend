import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReadOnlyCrudService } from '../generic.service';
import { Fakultet } from '../../models/fakultet';

@Injectable({
  providedIn: 'root'
})
export class FakultetService extends ReadOnlyCrudService<Fakultet, number> {

  constructor(http: HttpClient) {
    super(http, '/api/fakultet');
  }
}
