import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudService } from '../generic.service';
import { Ishod } from '../../models/ishod';

@Injectable({
  providedIn: 'root'
})
export class IshodService extends CrudService<Ishod, number> {

  constructor(http: HttpClient) {
    super(http, '/api/ishod');
  }
}
