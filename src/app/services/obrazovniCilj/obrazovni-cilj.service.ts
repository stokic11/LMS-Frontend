import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudService } from '../generic.service';
import { ObrazovniCilj } from '../../models/obrazovniCilj';

@Injectable({
  providedIn: 'root'
})
export class ObrazovniCiljService extends CrudService<ObrazovniCilj, number> {

  constructor(http: HttpClient) {
    super(http, '/api/obrazovniCilj');
  }
}
