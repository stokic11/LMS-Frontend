import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudService } from '../generic.service';
import { PohadjanjePredmeta } from '../../models/pohadjanjePredmeta';

@Injectable({
  providedIn: 'root'
})
export class PohadjanjePredmetaService extends CrudService<PohadjanjePredmeta, number> {

  constructor(http: HttpClient) {
    super(http, '/api/pohadjanjePredmeta');
  }
}
