import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudijskiProgramService } from '../../services/studijskiProgram/studijski-program.service';
import { GenericTableComponent, TableColumn } from '../generic-table/generic-table.component';

@Component({
  selector: 'app-studijski-program-table',
  imports: [GenericTableComponent],
  templateUrl: './studijski-program-table.component.html',
  styleUrl: './studijski-program-table.component.css'
})
export class StudijskiProgramTableComponent implements OnInit {
  studijskiProgramiDisplay: any[] = [];
  columns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'naziv', label: 'Naziv' },
    { key: 'fakultetNaziv', label: 'Fakultet' },
    { key: 'rukovodiocImePrezime', label: 'Rukovodilac' },
    { key: 'action', label: 'Akcije' }
  ];

  constructor(
    private studijskiProgramService: StudijskiProgramService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStudijskiProgrami();
  }

  loadStudijskiProgrami(): void {
    this.studijskiProgramService.getAllWithDetails().subscribe({
      next: (data) => {
        this.studijskiProgramiDisplay = data.map(sp => ({
          id: sp.id,
          naziv: sp.naziv,
          fakultetNaziv: sp.fakultetNaziv,
          rukovodiocImePrezime: sp.rukovodiocImePrezime,
          action: 'Prikaži detalje'
        }));
      },
      error: (error) => {
        console.error('Greška pri učitavanju studijskih programa:', error);
        alert('Greška pri učitavanju podataka iz baze. Proverite da li je backend pokrenut.');
      }
    });
  }

  onRowClick(row: any): void {
    if (row && row.id) {
      this.router.navigate(['/studijski-programi', row.id]);
    }
  }
}
