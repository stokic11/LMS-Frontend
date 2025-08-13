import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReadOnlyCrudService } from '../generic.service';
import { Uloga } from '../../models/uloga';

@Injectable({
  providedIn: 'root'
})
export class UlogaService extends ReadOnlyCrudService<Uloga, number> {

  constructor(http: HttpClient) {
    super(http, '/api/uloga');
  }
}
