import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericTableComponent, TableColumn, TableAction } from '../generic-table/generic-table.component';
import { EvaluacijaZnanjaService } from '../../services/evaluacijaZnanja/evaluacija-znanja.service';
import { PolaganjeService } from '../../services/polaganje/polaganje.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { EvaluacijaZnanja } from '../../models/evaluacijaZnanja';

@Component({
  selector: 'app-prijava-ispita',
  standalone: true,
  imports: [CommonModule, GenericTableComponent],
  template: `
    <div class="prijava-ispita-container">
      <h2 class="page-title">Prijava Ispita</h2>
      <p class="description">Ovde možete prijaviti ispite za predmete koje trenutno slušate.</p>
      
      <app-generic-table 
        [data]="data"
        [columns]="columns"
        [actions]="actions"
        [rowClickable]="false"
        [showDownloadButton]="false">
      </app-generic-table>
      
      <div *ngIf="data.length === 0" class="no-exams">
        <p>Trenutno nema dostupnih ispita za prijavu.</p>
      </div>

      <p class="description">Ovde su prikazani ispiti koje ste prijavili i čekaju ocenjivanje.</p>

      <app-generic-table 
        [data]="prijavljenaPolaganja"
        [columns]="prijavljenaColumns"
        [actions]="prijavljenaActions"
        [rowClickable]="false"
        [showDownloadButton]="false">
      </app-generic-table>
      
      <div *ngIf="prijavljenaPolaganja.length === 0" class="no-exams">
        <p>Nemate prijavljena polaganja.</p>
      </div>
    </div>
  `,
  styleUrls: ['./prijava-ispita.component.css']
})
export class PrijavaIspitaComponent implements OnInit {
  data: any[] = [];
  dostupniIspiti: any[] = [];
  prijavljenaPolaganja: any[] = [];
  
  columns: TableColumn[] = [
    { key: 'predmetNaziv', label: 'Predmet' },
    { key: 'tipEvaluacije', label: 'Tip' },
    { key: 'vremePocetka', label: 'Datum ispita' },
    { key: 'espb', label: 'ECTS' }
  ];

  actions: TableAction[] = [
    {
      label: 'Prijavi',
      color: 'custom',
      action: (row: any) => this.onActionClick('prijavi', row)
    }
  ];

  prijavljenaColumns: TableColumn[] = [
    { key: 'predmetNaziv', label: 'Predmet' },
    { key: 'tipEvaluacije', label: 'Tip' },
    { key: 'vremePocetka', label: 'Datum ispita' },
    { key: 'status', label: 'Status' }
  ];

  prijavljenaActions: TableAction[] = [
  ];

  constructor(
    private evaluacijaZnanjaService: EvaluacijaZnanjaService,
    private polaganjeService: PolaganjeService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.loadDostupneIspite();
    this.loadPrijavljenaPolaganja();
  }

  loadDostupneIspite(): void {
    const studentId = this.authService.getKorisnikId();
    if (studentId) {
      this.evaluacijaZnanjaService.getDostupneIspiteZaStudenta(studentId).subscribe({
        next: (ispiti: any) => {
          this.dostupniIspiti = ispiti;
          this.prepareTableData();
        },
        error: (error: any) => {
          console.error('Error loading dostupne ispite:', error);
        }
      });
    }
  }

  private prepareTableData(): void {
    this.data = this.dostupniIspiti.map((ispit, index) => ({
      id: ispit.id || 0,
      predmetNaziv: ispit.predmetNaziv || 'Nepoznat predmet',
      tipEvaluacije: ispit.tipEvaluacije?.naziv || 'Ispit',
      vremePocetka: new Date(ispit.vremePocetka).toLocaleDateString('sr-RS'),
      espb: ispit.espb || 6
    }));
  }

  private prijaviIspit(evaluacijaZnanjaId: number): void {
    const studentId = this.authService.getKorisnikId();
    if (studentId) {
      this.polaganjeService.prijaviIspit(studentId, evaluacijaZnanjaId).subscribe({
        next: (response: any) => {
          alert('Ispit je uspešno prijavljen!');
          this.loadDostupneIspite();
          this.loadPrijavljenaPolaganja();
        },
        error: (error: any) => {
          console.error('Error prijavljujući ispit:', error);
          alert('Greška pri prijavi ispita. Pokušajte ponovo.');
        }
      });
    }
  }

  loadPrijavljenaPolaganja(): void {
    const studentId = this.authService.getKorisnikId();
    if (studentId) {
      this.polaganjeService.getPrijavljenaPolaganja(studentId).subscribe({
        next: (polaganja: any) => {
          this.prijavljenaPolaganja = polaganja.map((polaganje: any) => ({
            id: polaganje.id,
            predmetNaziv: polaganje.predmetNaziv || 'Nepoznat predmet',
            tipEvaluacije: polaganje.tipEvaluacije || 'Ispit',
            vremePocetka: new Date(polaganje.vremePocetka).toLocaleDateString('sr-RS'),
            status: 'Prijavljen'
          }));
        },
        error: (error: any) => {
          console.error('Error loading prijavljena polaganja:', error);
          this.prijavljenaPolaganja = [];
        }
      });
    }
  }

  onActionClick(action: string, row: any): void {
    if (action === 'prijavi') {
      this.prijaviIspit(row.id);
    }
  }
}
