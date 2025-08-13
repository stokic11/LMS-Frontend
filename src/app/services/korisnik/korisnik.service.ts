import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WritableCrudService } from '../generic.service';
import { Korisnik } from '../../models/korisnik';

@Injectable({
  providedIn: 'root'
})
export class KorisnikService extends WritableCrudService<Korisnik, number> {

  constructor(http: HttpClient) {
    super(http, '/api/korisnik');
  }
}
