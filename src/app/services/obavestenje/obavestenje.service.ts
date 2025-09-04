import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrudService } from '../generic.service';
import { Obavestenje } from '../../models/obavestenje';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ObavestenjeService extends CrudService<Obavestenje, number> {

  constructor(
    http: HttpClient,
    private authService: AuthenticationService
  ) {
    super(http, '/api/obavestenja');
  }

  getByStudentId(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/obavestenja/student/${studentId}`);
  }

  getByNastavnikId(nastavnikId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/obavestenja/nastavnik/${nastavnikId}`);
  }

  getAllForAdmin(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/obavestenja/admin`);
  }

  getAllByRole(): Observable<any[]> {
    const roles = this.authService.getCurrentUserRoles();
    const userId = this.authService.getKorisnikId();
    
    if (roles.includes('admin') || roles.includes('studentska_sluzba')) {
      return this.getAllForAdmin();
    } else if (roles.includes('nastavnik') && userId) {
      return this.getByNastavnikId(userId);
    } else if (roles.includes('student') && userId) {
      return this.getByStudentId(userId);
    } else {
      return this.getAll();
    }
  }

  override getById(id: number): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/api/obavestenja/${id}`);
  }

  override put(id: number, body: Obavestenje): Observable<Obavestenje> {
    return this.http.put<Obavestenje>(`http://localhost:8080/api/obavestenja/${id}`, body);
  }

  override delete(id: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:8080/api/obavestenja/${id}`);
  }

  override create(body: Obavestenje): Observable<Obavestenje> {
    return this.http.post<Obavestenje>(`http://localhost:8080/api/obavestenja`, body);
  }
}
