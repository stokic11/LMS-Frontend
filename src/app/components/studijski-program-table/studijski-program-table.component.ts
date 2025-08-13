import { Component, OnInit } from '@angular/core';
import { StudijskiProgram } from '../../models/studijskiProgram';
import { GenericTableComponent, TableColumn } from '../generic-table/generic-table.component';

@Component({
  selector: 'app-studijski-program-table',
  imports: [GenericTableComponent],
  templateUrl: './studijski-program-table.component.html',
  styleUrl: './studijski-program-table.component.css'
})
export class StudijskiProgramTableComponent implements OnInit {
  studijskiProgrami: StudijskiProgram[] = [];
  studijskiProgramiDisplay: any[] = [];
  columns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'naziv', label: 'Naziv' },
    { key: 'fakultet', label: 'Fakultet' },
    { key: 'rukovodilac', label: 'Rukovodilac' }
  ];

  ngOnInit(): void {
    const fakultetFir: any = {
      id: 1,
      naziv: 'Fakultet informatike i računarstva'
    };

    const fakultetPoslovni: any = {
      id: 2,
      naziv: 'Poslovni fakultet'
    };

    const fakultetMediji: any = {
      id: 3,
      naziv: 'Fakultet za medije i komunikacije'
    };

    this.studijskiProgrami = [
      {
        id: 1,
        naziv: 'Informacioni sistemi i tehnologije',
        godineStudija: [],
        rukovodilac: {
          id: 1,
          ime: 'Prof. dr Dragan Vukmirović'
        } as any,
        fakultet: fakultetFir
      },
      {
        id: 2,
        naziv: 'Menadžment i organizacija',
        godineStudija: [],
        rukovodilac: {
          id: 2,
          ime: 'Prof. dr Milica Jovanović'
        } as any,
        fakultet: fakultetPoslovni
      },
      {
        id: 3,
        naziv: 'Digitalne komunikacije',
        godineStudija: [],
        rukovodilac: {
          id: 3,
          ime: 'Prof. dr Stefan Mitrović'
        } as any,
        fakultet: fakultetMediji
      }
    ];

    this.studijskiProgramiDisplay = this.studijskiProgrami.map(sp => ({
      id: sp.id,
      naziv: sp.naziv,
      fakultet: sp.fakultet.naziv,
      rukovodilac: sp.rukovodilac.ime
    }));
  }
}
