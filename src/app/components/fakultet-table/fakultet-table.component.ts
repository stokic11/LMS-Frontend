
import { Component, OnInit } from '@angular/core';
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
    { key: 'id', label: 'ID' },
    { key: 'naziv', label: 'Naziv' },
    { key: 'adresa', label: 'Adresa' },
    { key: 'univerzitet', label: 'Univerzitet' }
  ];

  constructor(private fakultetService: FakultetService) {}

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
          univerzitet: f.univerzitetId
        }));
        console.log('Dobijeni fakulteti:', data);
      },
      error: (error) => {
        console.error('Greška pri učitavanju fakulteta:', error);
        if (error.status === 403) {
          console.warn('Nedostaje autentifikacija - potrebno je prijaviti se');
        }
        this.loadMockData();
      }
    });
  }

  private loadMockData(): void {
    this.fakulteti = [
      {
        id: 1,
        naziv: 'Fakultet informatike i računarstva',
        adresa: {
          ulica: 'Danijelova',
          broj: '32',
          mesto: { naziv: 'Beograd', drzava: { naziv: 'Srbija' } }
        },
        univerzitetId: 1,
        dekanId: 1,
        studijskiProgramiIds: [1, 2]
      },
      {
        id: 2,
        naziv: 'Poslovni fakultet',
        adresa: {
          ulica: 'Danijelova',
          broj: '32',
          mesto: { naziv: 'Beograd', drzava: { naziv: 'Srbija' } }
        },
        univerzitetId: 1,
        dekanId: 2,
        studijskiProgramiIds: [3]
      },
      {
        id: 3,
        naziv: 'Fakultet za medije i komunikacije',
        adresa: {
          ulica: 'Danijelova',
          broj: '32',
          mesto: { naziv: 'Beograd', drzava: { naziv: 'Srbija' } }
        },
        univerzitetId: 1,
        dekanId: 3,
        studijskiProgramiIds: [4, 5]
      }
    ];
    this.fakultetiDisplay = this.fakulteti.map(f => ({
      id: f.id,
      naziv: f.naziv,
      adresa: f.adresa?.ulica + ' ' + f.adresa?.broj + ', ' + f.adresa?.mesto?.naziv,
      univerzitet: f.univerzitetId
    }));
  }
}
