import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { GenericTableComponent } from '../generic-table/generic-table.component';
import { Predmet } from '../../models/predmet';
import { PohadjanjePredmeta } from '../../models/pohadjanjePredmeta';
import { PredmetService } from '../../services/predmet/predmet.service';
import { PohadjanjePredmetaService } from '../../services/pohadjanjePredmeta/pohadjanje-predmeta.service';
import { RealizacijaPredmetaService } from '../../services/realizacijaPredmeta/realizacija-predmeta.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';

@Component({
  selector: 'app-predmet-table',
  standalone: true,
  imports: [CommonModule, GenericTableComponent, RouterModule],
  template: `
    <div class="predmet-table-wrapper">
      <h2 style="text-align:center; margin-bottom: 24px; color: #244855; font-weight: 600;">
        {{ isStudent ? 'Moji Predmeti' : 'Predmeti' }}
      </h2>
      <app-generic-table 
        [data]="data"
        [columns]="columns"
        [rowClickable]="true"
        (rowClick)="onPredmetClick($event)">
      </app-generic-table>
    </div>
  `,
  styleUrls: ['./predmet-table.component.css']
})
export class PredmetTableComponent implements OnInit {
  data: any[] = [];
  isStudent: boolean = false;
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
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkIfStudent();
    this.loadData();
  }

  checkIfStudent(): void {
    const roles = this.authService.getCurrentUserRoles();
    console.log('Current user roles:', roles);
    this.isStudent = roles.includes('student');
    console.log('Is student:', this.isStudent);
    
    if (this.isStudent) {
      this.columns = [
        { key: 'naziv', label: 'Naziv' },
        { key: 'espb', label: 'ESPB' },
        { key: 'obavezan', label: 'Tip' },
        { key: 'brojSemestra', label: 'Semestar' },
        { key: 'konacnaOcena', label: 'Ocena' }
      ];
    } else {
      console.log('Setting default columns');
    }
  }

  loadData(): void {
    if (this.isStudent) {
      const userId = this.authService.getKorisnikId();
      if (userId) {
        this.pohadjanjePredmetaService.getByStudentId(userId).subscribe({
          next: (pohadjanja) => {
            this.data = pohadjanja.map(pohadjanje => ({
              ...pohadjanje,
              naziv: pohadjanje.nazivPredmeta,
              obavezan: pohadjanje.obavezan ? 'Obavezan' : 'Izborni',
              konacnaOcena: pohadjanje.konacnaOcena || 'Nije ocenjen'
            }));
          },
          error: (error) => {
            console.error('Error loading student predmeti:', error);
            console.error('Error status:', error.status);
            console.error('Error message:', error.message);
            console.error('Error URL:', error.url);
            if (error.error) {
              console.error('Error details:', error.error);
            }
          }
        });
      }
    } else {
      this.predmetService.getAll().subscribe({
        next: (predmeti) => {
          this.data = predmeti.map(predmet => ({
            ...predmet,
            obavezan: predmet.obavezan ? 'Obavezan' : 'Izborni'
          }));
        },
        error: (error) => {
          console.error('Error loading predmeti:', error);
        }
      });
    }
  }

  onPredmetClick(predmet: any): void {
    if (this.isStudent) {
      // Za studenta, koristimo naziv predmeta da nađemo pravi predmet ID
      if (predmet.naziv) {
        this.predmetService.getAll().subscribe({
          next: (predmeti) => {
            const targetPredmet = predmeti.find(p => p.naziv === predmet.naziv);
            if (targetPredmet && targetPredmet.id) {
              this.router.navigate(['/predmeti', targetPredmet.id]);
            }
          },
          error: (error) => {
            console.error('Error loading predmeti:', error);
          }
        });
      }
    } else {
      // Za administratore, direktno koristimo predmet ID
      if (predmet.id) {
        this.router.navigate(['/predmeti', predmet.id]);
      }
    }
  }
}
