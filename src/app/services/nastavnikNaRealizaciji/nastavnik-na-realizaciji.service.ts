import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WritableCrudService } from '../generic.service';
import { NastavnikNaRealizaciji } from '../../models/nastavnikNaRealizaciji';

@Injectable({
  providedIn: 'root'
})
export class NastavnikNaRealizacijiService extends WritableCrudService<NastavnikNaRealizaciji, number> {

  constructor(http: HttpClient) {
    super(http, '/api/nastavnici-na-realizaciji');
  }
}
