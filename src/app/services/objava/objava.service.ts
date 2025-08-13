import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudService } from '../generic.service';
import { Objava } from '../../models/objava';

@Injectable({
  providedIn: 'root'
})
export class ObjavaService extends CrudService<Objava, number> {

  constructor(http: HttpClient) {
    super(http, '/api/objava');
  }
}
