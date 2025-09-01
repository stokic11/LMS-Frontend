import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WritableCrudService } from '../generic.service';
import { RealizacijaPredmeta } from '../../models/realizacijaPredmeta';

@Injectable({
  providedIn: 'root'
})
export class RealizacijaPredmetaService extends WritableCrudService<RealizacijaPredmeta, number> {

  constructor(http: HttpClient) {
    super(http, '/api/realizacije-predmeta');
  }
}
