import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudService } from '../generic.service';
import { Mesto } from '../../models/mesto';

@Injectable({
  providedIn: 'root'
})
export class MestoService extends CrudService<Mesto, number> {

  constructor(http: HttpClient) {
    super(http, '/api/mesta');
  }
}
