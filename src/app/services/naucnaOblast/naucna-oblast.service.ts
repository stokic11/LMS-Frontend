import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReadOnlyCrudService } from '../generic.service';
import { NaucnaOblast } from '../../models/naucnaOblast';

@Injectable({
  providedIn: 'root'
})
export class NaucnaOblastService extends ReadOnlyCrudService<NaucnaOblast, number> {

  constructor(http: HttpClient) {
    super(http, '/api/naucne-oblasti');
  }
}
