import { Component, OnInit } from '@angular/core';
import { Univerzitet } from '../../models/univerzitet';
import { Nastavnik } from '../../models/nastavnik';
import { UniverzitetService } from '../../services/univerzitet/univerzitet.service';
import { NastavnikService } from '../../services/nastavnik/nastavnik.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-homepage',
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatChipsModule
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit {
  univerzitet: Univerzitet | null = null;
  univerzitetInfo: any = null;
  rektor: Nastavnik | null = null;
  loading = false;
  error = false;
  latitude: number = 45.253186;
  longitude: number = 19.8444;

  constructor(
    private univerzitetService: UniverzitetService,
    private nastavnikService: NastavnikService
  ) {}

  onImageError(event: any): void {
    event.target.style.display = 'none';
    event.target.parentElement.innerHTML = `
      <div class="placeholder-image">
        <mat-icon>school</mat-icon>
        <p>Slika univerziteta</p>
      </div>
    `;
  }

  goToFakulteti() {
    window.location.href = '/fakulteti';
  }

  goToStudijskiProgrami() {
    window.location.href = '/studijski-programi';
  }

  ngOnInit(): void {
    this.univerzitet = {
      id: 1,
      naziv: 'Univerzitet Singidunum',
      datumOsnivanja: new Date('2005-01-01'),
      adresa: {
        id: 1,
        ulica: 'Danijelova',
        broj: '32',
        mesto: {
          id: 1,
          naziv: 'Beograd',
          drzava: {
            id: 1,
            naziv: 'Srbija'
          }
        }
      },
      rektorId: 1,
      fakultetiIds: [1, 2, 3]
    };

    this.loadUniverzitetFromBackend(1);
  }

  loadUniverzitetFromBackend(id: number): void {
    console.log('Pokušavam da učitam univerzitet iz backend-a za ID:', id);
    
    this.univerzitetService.getUniverzitetInfo(id).subscribe({
      next: (infoData) => {
        console.log('Uspešno dobijeni info podaci o univerzitetu:', infoData);
        this.univerzitetInfo = infoData;
        
        this.univerzitetService.getById(id).subscribe({
          next: (detailsData) => {
            console.log('Uspešno dobijeni detalji univerziteta:', detailsData);
            this.univerzitet = detailsData;
            
            if (infoData && infoData.rektorId) {
              this.loadRektorFromBackend(infoData.rektorId);
            }
          },
          error: (error) => {
            console.error('Greška pri učitavanju detalja univerziteta:', error);
          }
        });
      },
      error: (error) => {
        console.error('Greška pri učitavanju info o univerzitetu:', error);
        this.univerzitetInfo = {
          id: 1,
          naziv: 'Univerzitet Singidunum',
          rektorId: 1,
          rektorIme: 'Prof. dr Dragan Domazet'
        };
      }
    });
  }

  loadRektorFromBackend(rektorId: number): void {
    console.log('Pokušavam da učitam rektora iz backend-a za ID:', rektorId);
    
    this.nastavnikService.getById(rektorId).subscribe({
      next: (data) => {
        console.log('Uspešno dobijeni podaci o rektoru:', data);
        this.rektor = data;
      },
      error: (error) => {
        console.error('Greška pri učitavanju rektora:', error);
        this.rektor = {
          id: 1,
          ime: 'Prof. dr Dragan Domazet',
          email: 'dragan.domazet@singidunum.ac.rs',
          biografija: 'Prof. dr Dragan Domazet je rektor Univerziteta Singidunum.',
          zvanje: {
            tipZvanja: { naziv: 'Redovni profesor' },
            naucnaOblast: { naziv: 'Ekonomija' }
          }
        } as any;
      }
    });
  }
}
