import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReadOnlyCrudService } from '../generic.service';
import { Zvanje } from '../../models/zvanje';

@Injectable({
  providedIn: 'root'
})
export class ZvanjeService extends ReadOnlyCrudService<Zvanje, number> {

  constructor(http: HttpClient) {
    super(http, '/api/zvanja');
  }
}
