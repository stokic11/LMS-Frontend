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
    this.studijskiProgrami = [
      {
        id: 1,
        naziv: 'Informacioni sistemi i tehnologije',
        godineStudijaIds: [1, 2, 3, 4],
        rukovodilaId: 1,
        fakultetId: 1
      },
      {
        id: 2,
        naziv: 'Menadžment i organizacija',
        godineStudijaIds: [1, 2, 3, 4],
        rukovodilaId: 2,
        fakultetId: 2
      },
      {
        id: 3,
        naziv: 'Digitalne komunikacije',
        godineStudijaIds: [1, 2, 3, 4],
        rukovodilaId: 3,
        fakultetId: 3
      }
    ];

    this.studijskiProgramiDisplay = this.studijskiProgrami.map(sp => ({
      id: sp.id,
      naziv: sp.naziv,
      fakultet: `Fakultet ID: ${sp.fakultetId}`,
      rukovodilac: `Nastavnik ID: ${sp.rukovodilaId}`
    }));
  }
}
