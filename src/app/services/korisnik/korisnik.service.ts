import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrudService } from '../generic.service';
import { Korisnik } from '../../models/korisnik';
import { AppConstants } from '../../constants';

export interface KorisnikCreateRequest {
  korisnickoIme: string;
  lozinka: string;
  email: string;
  ime: string;
  prezime: string;
  nazivUloge: string;
  jmbg: string;
  ulica: string;
  broj: string;
  nazivMesta: string;
  nazivDrzave: string;
}

@Injectable({
  providedIn: 'root'
})
export class KorisnikService extends CrudService<Korisnik, number> {

  constructor(http: HttpClient) {
    super(http, `${AppConstants.BASE_URL}korisnici`);
  }

  createUserWithRole(request: KorisnikCreateRequest): Observable<any> {
    return this.http.post<any>(this.baseUrl, request);
  }
}
