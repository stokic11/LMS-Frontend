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
  templateUrl: './prijava-ispita.component.html',
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
        }
      });
    }
  }

  private prepareTableData(): void {
    this.data = this.dostupniIspiti.map((ispit, index) => ({
      id: ispit.id || 0,
      predmetNaziv: ispit.predmetNaziv || 'Nepoznat predmet',
      tipEvaluacije: ispit.tipEvaluacije?.naziv || 'Ispit',
      vremePocetka: ispit.vremePocetka,
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
            vremePocetka: polaganje.vremePocetka,
            status: 'Prijavljen'
          }));
        },
        error: (error: any) => {
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
