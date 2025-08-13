
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
    const univerzitet = {
      id: 1,
      naziv: 'Univerzitet Singidunum',
      datumOsnivanja: new Date('2005-01-01'),
      adresa: {
        ulica: 'Danijelova',
        broj: '32',
        mesto: { naziv: 'Beograd', drzava: { naziv: 'Srbija' } }
      },
      rektor: {
        id: 1,
        korisnickoIme: 'rektor.singidunum',
        lozinka: 'password123',
        email: 'rektor@singidunum.ac.rs',
        ime: 'Prof. dr Milovan Stanišić',
        biografija: 'Renomirani akademik i osnivač Univerziteta Singidunum.',
        jmbg: '1503965800001',
        zvanje: 'Redovni profesor',
        uloga: { id: 1, naziv: 'Rektor' }
      }
    };
    this.fakulteti = [
      {
        id: 1,
        naziv: 'Fakultet informatike i računarstva',
        adresa: {
          ulica: 'Danijelova',
          broj: '32',
          mesto: { naziv: 'Beograd', drzava: { naziv: 'Srbija' } }
        },
        univerzitet
      },
      {
        id: 2,
        naziv: 'Poslovni fakultet',
        adresa: {
          ulica: 'Danijelova',
          broj: '32',
          mesto: { naziv: 'Beograd', drzava: { naziv: 'Srbija' } }
        },
        univerzitet
      },
      {
        id: 3,
        naziv: 'Fakultet za medije i komunikacije',
        adresa: {
          ulica: 'Danijelova',
          broj: '32',
          mesto: { naziv: 'Beograd', drzava: { naziv: 'Srbija' } }
        },
        univerzitet
      }
    ];
    this.fakultetiDisplay = this.fakulteti.map(f => ({
      id: f.id,
      naziv: f.naziv,
      adresa: f.adresa?.ulica + ' ' + f.adresa?.broj + ', ' + f.adresa?.mesto?.naziv,
      univerzitet: f.univerzitet?.naziv
    }));
  }
}
