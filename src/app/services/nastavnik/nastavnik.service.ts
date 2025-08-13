import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WritableCrudService } from '../generic.service';
import { Nastavnik } from '../../models/nastavnik';

@Injectable({
  providedIn: 'root'
})
export class NastavnikService extends WritableCrudService<Nastavnik, number> {

  constructor(http: HttpClient) {
    super(http, '/api/nastavnik');
  }
}
