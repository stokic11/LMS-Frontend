import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrudService } from '../generic.service';
import { IzdataKnjiga } from '../../models/izdata-knjiga.model';
import { AppConstants } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class IzdataKnjigaService extends CrudService<IzdataKnjiga, number> {

  constructor(http: HttpClient) {
    super(http, AppConstants.buildUrl('izdata-knjiga'));
  }

  getMojeKnjige(): Observable<IzdataKnjiga[]> {
    return this.http.get<IzdataKnjiga[]>(`${this.baseUrl}/moje`);
  }

  findPendingRequests(): Observable<IzdataKnjiga[]> {
    return this.http.get<IzdataKnjiga[]>(`${this.baseUrl}/pending`);
  }

  traziKnjigu(knjigaId: number): Observable<IzdataKnjiga> {
    return this.http.post<IzdataKnjiga>(`${this.baseUrl}/trazi/${knjigaId}`, {});
  }

  odobri(id: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/odobri`, {});
  }

  vrati(id: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/vrati`, {});
  }
}
