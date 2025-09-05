
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FakultetService } from '../../services/fakultet/fakultet.service';
import { Fakultet } from '../../models/fakultet';
import { GenericTableComponent, TableColumn } from '../generic-table/generic-table.component';

@Component({
  selector: 'app-fakultet-table',
  standalone: true,
  imports: [GenericTableComponent],
  templateUrl: './fakultet-table.component.html',
  styleUrl: './fakultet-table.component.css'
})
export class FakultetTableComponent implements OnInit {
  fakulteti: Fakultet[] = [];
  fakultetiDisplay: any[] = [];
  columns: TableColumn[] = [
    { key: 'id', label: 'Redni broj' },
    { key: 'naziv', label: 'Naziv' },
    { key: 'adresa', label: 'Adresa' }
  ];

  constructor(
    private fakultetService: FakultetService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFakulteti();
  }
  loadFakulteti(): void {
    this.fakultetService.getAll().subscribe({
      next: (data) => {
        this.fakulteti = data;
        this.fakultetiDisplay = this.fakulteti.map(f => ({
          id: f.id,
          naziv: f.naziv,
          adresa: f.adresa?.ulica + ' ' + f.adresa?.broj + ', ' + f.adresa?.mesto?.naziv,
        }));
      },
      error: (error) => {
        console.error('Greška pri učitavanju fakulteta:', error);
        if (error.status === 403) {
          console.warn('Nedostaje autentifikacija - potrebno je prijaviti se');
        }
      }
    });
  }
  onFakultetClick(row: any): void {
    this.router.navigate(['/fakulteti', row.id]);
  }
}
