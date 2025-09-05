import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericTableComponent, TableColumn, TableAction } from '../generic-table/generic-table.component';
import { EvaluacijaZnanjaService } from '../../services/evaluacijaZnanja/evaluacija-znanja.service';
import { PolaganjeService } from '../../services/polaganje/polaganje.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { EvaluacijaZnanja } from '../../models/evaluacijaZnanja';
import { Polaganje } from '../../models/polaganje';

interface DostupanIspit {
  id: number;
  predmetNaziv: string;
  tipEvaluacije: string;
  vremePocetka: Date;
  espb: number;
}

interface PrijavljenoPolaganje {
  id: number;
  predmetNaziv: string;
  tipEvaluacije: string;
  vremePocetka: Date;
  status: string;
}

@Component({
  selector: 'app-prijava-ispita',
  standalone: true,
  imports: [CommonModule, GenericTableComponent],
  templateUrl: './prijava-ispita.component.html',
  styleUrls: ['./prijava-ispita.component.css']
})
export class PrijavaIspitaComponent implements OnInit {
  dostupniIspiti: EvaluacijaZnanja[] = [];
  prijavljenaPolaganja: Polaganje[] = [];
  
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
      action: (row: DostupanIspit) => this.onActionClick('prijavi', row)
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

  get data(): DostupanIspit[] {
    return this.dostupniIspiti.map((ispit: any): DostupanIspit => ({
      id: ispit.id || 0,
      predmetNaziv: ispit.predmetNaziv || 'Nepoznat predmet',
      tipEvaluacije: ispit.tipEvaluacije?.naziv || 'Ispit',
      vremePocetka: ispit.vremePocetka,
      espb: ispit.espb || 6
    }));
  }

  loadDostupneIspite(): void {
    let studentId = this.authService.getKorisnikId();
    if (studentId) {
      this.evaluacijaZnanjaService.getDostupneIspiteZaStudenta(studentId).subscribe({
        next: (ispiti: EvaluacijaZnanja[]) => {
          this.dostupniIspiti = ispiti;
        },
        error: (error: any) => {
        }
      });
    }
  }

  private prijaviIspit(evaluacijaZnanjaId: number): void {
    let studentId = this.authService.getKorisnikId();
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
    let studentId = this.authService.getKorisnikId();
    if (studentId) {
      this.polaganjeService.getPrijavljenaPolaganja(studentId).subscribe({
        next: (polaganja: Polaganje[]) => {
          this.prijavljenaPolaganja = polaganja;
        },
        error: (error: any) => {
          this.prijavljenaPolaganja = [];
        }
      });
    }
  }

  get prijavljenaData(): PrijavljenoPolaganje[] {
    return this.prijavljenaPolaganja.map((polaganje: any): PrijavljenoPolaganje => ({
      id: polaganje.id || 0,
      predmetNaziv: polaganje.predmetNaziv || 'Nepoznat predmet',
      tipEvaluacije: polaganje.tipEvaluacije || 'Ispit',
      vremePocetka: polaganje.vremePocetka,
      status: 'Prijavljen'
    }));
  }

  onActionClick(action: string, row: DostupanIspit): void {
    if (action === 'prijavi') {
      this.prijaviIspit(row.id);
    }
  }
}
