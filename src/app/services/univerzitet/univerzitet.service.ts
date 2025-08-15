import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReadOnlyCrudService } from '../generic.service';
import { Univerzitet } from '../../models/univerzitet';

@Injectable({
  providedIn: 'root'
})
export class UniverzitetService extends ReadOnlyCrudService<Univerzitet, number> {

  constructor(http: HttpClient) {
    super(http, '/api/univerziteti');
  }
}
