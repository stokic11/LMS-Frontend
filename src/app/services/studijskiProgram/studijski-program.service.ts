import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { WritableCrudService } from '../generic.service';
import { StudijskiProgram } from '../../models/studijskiProgram';

@Injectable({
  providedIn: 'root'
})
export class StudijskiProgramService extends WritableCrudService<StudijskiProgram, number> {

  constructor(http: HttpClient) {
    super(http, '/api/studijski-programi');
  }

  getStudijskiProgramInfo(id: number): Observable<any> {
    const backendUrl = `http://localhost:8080/api/studijski-programi/${id}/info`;
    console.log('Pozivam backend URL za detaljne informacije o studijskom programu:', backendUrl);
    return this.http.get<any>(backendUrl);
  }

  getAllWithDetails(): Observable<any[]> {
    return new Observable(observer => {
      this.getAll().subscribe({
        next: (programi) => {
          const programiArray = Array.from(programi);
          
          if (programiArray.length === 0) {
            observer.next([]);
            observer.complete();
            return;
          }

          // Povuci dodatne informacije za svaki program
          const detailRequests = programiArray.map(program => 
            new Observable(obs => {
              // Povuci fakultet info
              const fakultetUrl = `http://localhost:8080/api/fakulteti/${program.fakultetId}`;
              const nastavnikUrl = `http://localhost:8080/api/nastavnici/${program.rukovodilaId}`;
              
              forkJoin({
                fakultet: this.http.get<any>(fakultetUrl),
                nastavnik: this.http.get<any>(nastavnikUrl)
              }).subscribe({
                next: (result) => {
                  obs.next({
                    ...program,
                    fakultetNaziv: result.fakultet.naziv,
                    rukovodiocImePrezime: `${result.nastavnik.ime} ${result.nastavnik.prezime}`
                  });
                  obs.complete();
                },
                error: (error) => {
                  console.error('Greška pri učitavanju detalja:', error);
                  obs.next({
                    ...program,
                    fakultetNaziv: `Fakultet ID: ${program.fakultetId}`,
                    rukovodiocImePrezime: `Nastavnik ID: ${program.rukovodilaId}`
                  });
                  obs.complete();
                }
              });
            })
          );

          forkJoin(detailRequests).subscribe({
            next: (results) => {
              observer.next(results);
              observer.complete();
            },
            error: (error) => {
              observer.error(error);
            }
          });
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }
}
