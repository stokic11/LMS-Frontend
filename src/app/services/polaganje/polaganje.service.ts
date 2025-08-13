import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WritableCrudService } from '../generic.service';
import { Polaganje } from '../../models/polaganje';

@Injectable({
  providedIn: 'root'
})
export class PolaganjeService extends WritableCrudService<Polaganje, number> {

  constructor(http: HttpClient) {
    super(http, '/api/polaganje');
  }
}
