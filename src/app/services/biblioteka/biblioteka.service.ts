import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrudService } from '../generic.service';
import { Biblioteka } from '../../models/biblioteka.model';
import { AppConstants } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class BibliotekaService extends CrudService<Biblioteka, number> {

  constructor(http: HttpClient) {
    super(http, AppConstants.buildUrl('biblioteka'));
  }

  dodajPrimerke(bibliotekaId: number, brojPrimeraka: number): Observable<void> {
    return this.http.post<void>(`${AppConstants.buildUrl('biblioteka')}/${bibliotekaId}/dodaj-primerke`, { brojPrimeraka });
  }
}
