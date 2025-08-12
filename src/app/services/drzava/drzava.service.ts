import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReadOnlyCrudService } from '../generic.service';
import { Drzava } from '../../models/drzava';

@Injectable({
  providedIn: 'root'
})
export class DrzavaService extends ReadOnlyCrudService<Drzava, number> {

  constructor(http: HttpClient) {
    super(http, '/api/drzava');
  }
}
