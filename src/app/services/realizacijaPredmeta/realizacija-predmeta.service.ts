import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudService } from '../generic.service';
import { RealizacijaPredmeta } from '../../models/realizacijaPredmeta';

@Injectable({
  providedIn: 'root'
})
export class RealizacijaPredmetaService extends CrudService<RealizacijaPredmeta, number> {

  constructor(http: HttpClient) {
    super(http, '/api/realizacijaPredmeta');
  }
}
