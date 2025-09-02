import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { GenericTableComponent, TableColumn } from '../generic-table/generic-table.component';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { PolaganjeService } from '../../services/polaganje/polaganje.service';

interface IstorijaItem {
  predmetNaziv: string;
  brojPolaganja: number;
  konacniBodovi: number;
  ocena: number;
  espb: number;
  datum?: string;
  status: 'polozeno' | 'palo';
}

@Component({
  selector: 'app-student-istorija',
  standalone: true,
  imports: [CommonModule, MatCardModule, GenericTableComponent],
  template: `
    <div class="istorija-container">
      <h2 class="page-title">Istorija Studiranja</h2>
      
      <!-- Sumarni podaci -->
      <div class="summary-cards">
        <mat-card class="summary-card">
          <mat-card-header>
            <mat-card-title>Prosečna ocena</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="summary-value">{{ prosecnaOcena | number:'1.2-2' }}</div>
          </mat-card-content>
        </mat-card>
        
        <mat-card class="summary-card">
          <mat-card-header>
            <mat-card-title>Ukupno ECTS</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="summary-value">{{ ukupnoECTS }}</div>
          </mat-card-content>
        </mat-card>
        
        <mat-card class="summary-card">
          <mat-card-header>
            <mat-card-title>Položeno predmeta</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="summary-value">{{ polozeniPredmeti }}</div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Tabela sa istorijom -->
      <div class="history-table-wrapper">
        <app-generic-table 
          [data]="data"
          [columns]="columns"
          [rowClickable]="false"
          [showDownloadButton]="false">
        </app-generic-table>
      </div>
    </div>
  `,
  styleUrls: ['./student-istorija.component.css']
})
export class StudentIstorijaComponent implements OnInit {
  istorija: IstorijaItem[] = [];
  data: any[] = [];
  
  columns: TableColumn[] = [
    { key: 'predmetNaziv', label: 'Predmet' },
    { key: 'brojPolaganja', label: 'Br. polaganja' },
    { key: 'konacniBodovi', label: 'Bodovi' },
    { key: 'ocena', label: 'Ocena' },
    { key: 'espb', label: 'ECTS' },
    { key: 'statusText', label: 'Status' }
  ];
  
  prosecnaOcena: number = 0;
  ukupnoECTS: number = 0;
  polozeniPredmeti: number = 0;

  constructor(
    private authService: AuthenticationService,
    private polaganjeService: PolaganjeService
  ) {}

  ngOnInit(): void {
    this.loadIstorija();
  }

  loadIstorija(): void {
    const studentId = this.authService.getKorisnikId();
    if (studentId) {
      this.polaganjeService.getIstorijaStudiranja(studentId).subscribe({
        next: (data) => {
          this.istorija = data.map(item => ({
            predmetNaziv: item.predmetNaziv,
            brojPolaganja: item.brojPolaganja,
            konacniBodovi: item.konacniBodovi,
            ocena: item.ocena,
            espb: item.espb,
            status: item.status
          }));
          this.calculateSummary();
        },
        error: (error) => {
          console.error('Error loading istorija studiranja:', error);
        }
      });
    }
  }


  private calculateSummary(): void {
    const polozeni = this.istorija.filter(item => item.status === 'polozeno');
    
    this.polozeniPredmeti = polozeni.length;
    this.ukupnoECTS = polozeni.reduce((sum, item) => sum + item.espb, 0);
    
    if (polozeni.length > 0) {
      const sumaOcena = polozeni.reduce((sum, item) => sum + item.ocena, 0);
      this.prosecnaOcena = sumaOcena / polozeni.length;
    }

    this.data = this.istorija.map(item => ({
      ...item,
      statusText: item.status === 'polozeno' ? 'Položeno' : 'Palo'
    }));
  }

  private formatOcena(ocena: number, status: string): string {
    return ocena.toString();
  }

  private formatStatus(status: string): string {
    return status === 'polozeno' ? 'Položeno' : 'Palo';
  }

  getOcenaClass(ocena: number): string {
    if (ocena >= 9) return 'ocena-odlican';
    if (ocena >= 8) return 'ocena-vrlo-dobar';
    if (ocena >= 7) return 'ocena-dobar';
    if (ocena >= 6) return 'ocena-dovoljan';
    return 'ocena-nedovoljan';
  }

  getStatusClass(status: string): string {
    return status === 'polozeno' ? 'status-polozeno' : 'status-palo';
  }
}
