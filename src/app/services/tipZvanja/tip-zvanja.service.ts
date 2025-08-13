import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReadOnlyCrudService } from '../generic.service';
import { TipZvanja } from '../../models/tipZvanja';

@Injectable({
  providedIn: 'root'
})
export class TipZvanjaService extends ReadOnlyCrudService<TipZvanja, number> {

  constructor(http: HttpClient) {
    super(http, '/api/tipZvanja');
  }
}
