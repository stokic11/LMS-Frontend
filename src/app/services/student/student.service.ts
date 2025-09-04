import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WritableCrudService } from '../generic.service';
import { Student } from '../../models/student';
import { AppConstants } from '../../constants';

export interface GodinaStudija {
  id: number;
  godinaPocetka: string;
  godinaKraja: string;
  studijskiProgramId: number;
  studijskiProgramNaziv: string;
}

export interface StudentNaGodini {
  id: number;
  datumUpisa: Date;
  brojIndeksa: string;
  studentId: number;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService extends WritableCrudService<Student, number> {

  constructor(http: HttpClient) {
    super(http, AppConstants.buildUrl('studenti'));
  }

  getNeupisaniStudenti(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.baseUrl}/neupisani`);
  }

  getGodineStudija(): Observable<GodinaStudija[]> {
    const url = AppConstants.buildUrl('godine-studija');
    return this.http.get<GodinaStudija[]>(url);
  }

  upisStudentaNaGodinu(studentId: number, godinaStudijaId: number, brojIndeksa: string): Observable<StudentNaGodini> {
    return this.http.post<StudentNaGodini>(
      `${this.baseUrl}/${studentId}/upisi/${godinaStudijaId}?brojIndeksa=${brojIndeksa}`,
      {}
    );
  }

  getStudentDetails(studentId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${studentId}/details`);
  }

  getOsnovniPodaci(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${studentId}/osnovni-podaci`);
  }

  getAkademskiPodaci(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${studentId}/akademski-podaci`);
  }

  getPolozeniIspiti(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${studentId}/polozeni-ispiti`);
  }

  getNeuspesnaPolaganja(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${studentId}/neuspesna-polaganja`);
  }

  getUpisi(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${studentId}/upisi`);
  }
}
