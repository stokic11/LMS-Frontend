import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudService } from '../generic.service';
import { Adresa } from '../../models/adresa';

@Injectable({
  providedIn: 'root'
})
export class AdresaService extends CrudService<Adresa, number> {

  constructor(http: HttpClient) {
    super(http, '/api/adrese');
  }
}
