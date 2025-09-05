import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { GenericTableComponent } from '../generic-table/generic-table.component';
import { Predmet } from '../../models/predmet';
import { PohadjanjePredmeta } from '../../models/pohadjanjePredmeta';
import { PredmetService } from '../../services/predmet/predmet.service';
import { PohadjanjePredmetaService } from '../../services/pohadjanjePredmeta/pohadjanje-predmeta.service';
import { RealizacijaPredmetaService } from '../../services/realizacijaPredmeta/realizacija-predmeta.service';
import { NastavnikService } from '../../services/nastavnik/nastavnik.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';

@Component({
  selector: 'app-predmet-table',
  standalone: true,
  imports: [CommonModule, GenericTableComponent, RouterModule],
  templateUrl: './predmet-table.component.html',
  styleUrls: ['./predmet-table.component.css']
})
export class PredmetTableComponent implements OnInit {
  predmeti: Predmet[] = [];
  pohadjanja: PohadjanjePredmeta[] = [];
  nastavnikPredmeti: any[] = [];
  
  isStudent: boolean = false;
  isNastavnik: boolean = false;
  columns = [
    { key: 'naziv', label: 'Naziv' },
    { key: 'espb', label: 'ESPB' },
    { key: 'obavezan', label: 'Tip' },
    { key: 'brojSemestra', label: 'Semestar' },
    { key: 'brojPredavanja', label: 'Broj Predavanja' },
    { key: 'brojVezbi', label: 'Broj Vežbi' }
  ];

  constructor(
    private predmetService: PredmetService,
    private pohadjanjePredmetaService: PohadjanjePredmetaService,
    private realizacijaPredmetaService: RealizacijaPredmetaService,
    private nastavnikService: NastavnikService,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkUserRole();
    this.loadData();
  }

  get data(): any[] {
    if (this.isStudent) {
      return this.pohadjanja.map(pohadjanje => ({
        ...pohadjanje,
        naziv: pohadjanje.nazivPredmeta,
        obavezan: pohadjanje.obavezan ? 'Obavezan' : 'Izborni',
        konacnaOcena: pohadjanje.konacnaOcena || 'Nije ocenjen'
      }));
    } else if (this.isNastavnik) {
      return this.nastavnikPredmeti.map(predmet => ({
        ...predmet,
        obavezan: predmet.obavezan ? 'Obavezan' : 'Izborni'
      }));
    } else {
      return this.predmeti.map(predmet => ({
        ...predmet,
        obavezan: predmet.obavezan ? 'Obavezan' : 'Izborni'
      }));
    }
  }

  checkUserRole(): void {
    let roles = this.authService.getCurrentUserRoles();
    this.isStudent = roles.includes('student');
    this.isNastavnik = roles.includes('nastavnik');
    
    if (this.isStudent) {
      this.columns = [
        { key: 'naziv', label: 'Naziv' },
        { key: 'espb', label: 'ESPB' },
        { key: 'obavezan', label: 'Tip' },
        { key: 'brojSemestra', label: 'Semestar' },
        { key: 'konacnaOcena', label: 'Ocena' }
      ];
    }
  }

  loadData(): void {
    if (this.isStudent) {
      let userId = this.authService.getKorisnikId();
      if (userId) {
        this.pohadjanjePredmetaService.getByStudentId(userId).subscribe({
          next: (pohadjanja) => {
            this.pohadjanja = pohadjanja.map(pohadjanje => ({
              ...pohadjanje,
              nazivPredmeta: pohadjanje.nazivPredmeta,
              konacnaOcena: pohadjanje.konacnaOcena
            }));
          },
          error: (error) => {
            
          }
        });
      }
    } else if (this.isNastavnik) {
      let userId = this.authService.getKorisnikId();
      if (userId) {
        this.nastavnikService.getPredmeti(userId).subscribe({
          next: (predmeti) => {
            this.nastavnikPredmeti = predmeti.map((row: any[]) => ({
              id: row[0],
              naziv: row[1],
              espb: row[2],
              obavezan: row[3],
              brojSemestra: row[4],
              brojPredavanja: row[5],
              brojVezbi: row[6]
            }));
          },
          error: (error) => {
            
          }
        });
      }
    } else {
      this.predmetService.getAll().subscribe({
        next: (predmeti) => {
          this.predmeti = predmeti.map(predmet => ({
            ...predmet
          }));
        },
        error: (error) => {
          
        }
      });
    }
  }

  onPredmetClick(predmet: any): void {
    if (this.isStudent) {
      if (predmet.naziv) {
        let targetPohadjanje = this.pohadjanja.find(p => p.nazivPredmeta === predmet.naziv);
        if (targetPohadjanje && targetPohadjanje.realizacijaPredmetaId) {
          this.predmetService.getAll().subscribe({
            next: (predmeti) => {
              let targetPredmet = predmeti.find(p => p.naziv === predmet.naziv);
              if (targetPredmet && targetPredmet.id) {
                this.router.navigate(['/predmeti', targetPredmet.id]);
              }
            },
            error: (error) => {
              
            }
          });
        }
      }
    } else {
      if (predmet.id) {
        this.router.navigate(['/predmeti', predmet.id]);
      }
    }
  }
}
