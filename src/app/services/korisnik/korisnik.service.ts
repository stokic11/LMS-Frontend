import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudService } from '../generic.service';
import { Korisnik } from '../../models/korisnik';
import { AppConstants } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class KorisnikService extends CrudService<Korisnik, number> {

  constructor(http: HttpClient) {
    super(http, `${AppConstants.BASE_URL}korisnici`);
  }
}
