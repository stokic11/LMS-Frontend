import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudService } from '../generic.service';
import { GodinaStudija } from '../../models/godinaStudija';

@Injectable({
  providedIn: 'root'
})
export class GodinaStudijaService extends CrudService<GodinaStudija, number> {

  constructor(http: HttpClient) {
    super(http, '/api/godine-studija');
  }
}
