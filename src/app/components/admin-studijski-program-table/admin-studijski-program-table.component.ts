import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { StudijskiProgramService } from '../../services/studijskiProgram/studijski-program.service';
import { GenericTableComponent, TableColumn, TableAction } from '../generic-table/generic-table.component';
import { StudijskiProgramDialogComponent, StudijskiProgramDialogData } from '../studijski-program-dialog/studijski-program-dialog.component';

@Component({
  selector: 'app-admin-studijski-program-table',
  standalone: true,
  imports: [CommonModule, GenericTableComponent, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './admin-studijski-program-table.component.html',
  styleUrl: './admin-studijski-program-table.component.css'
})
export class AdminStudijskiProgramTableComponent implements OnInit {
  studijskiProgramiDisplay: any[] = [];
  columns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'naziv', label: 'Naziv' },
    { key: 'fakultetNaziv', label: 'Fakultet' },
    { key: 'rukovodiocImePrezime', label: 'Rukovodilac' }
  ];

  actions: TableAction[] = GenericTableComponent.createDefaultActions(
    (item: any) => this.onIzmeni(item),
    (item: any) => this.onObrisi(item)
  );

  constructor(
    private studijskiProgramService: StudijskiProgramService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadStudijskiProgrami();
  }

  loadStudijskiProgrami(): void {
    this.studijskiProgramService.getAllWithDetails().subscribe({
      next: (data) => {
        this.studijskiProgramiDisplay = data
          .filter(sp => !sp.obrisan)
          .map(sp => ({
            id: sp.id,
            naziv: sp.naziv,
            fakultetNaziv: sp.fakultetNaziv,
            rukovodiocImePrezime: sp.rukovodiocImePrezime
          }));
      },
      error: (error) => {
        console.error('Greška pri učitavanju studijskih programa:', error);
        alert('Greška pri učitavanju podataka iz baze. Proverite da li je backend pokrenut.');
      }
    });
  }

  onIzmeni(studijskiProgram: any): void {
    this.studijskiProgramService.getById(studijskiProgram.id).subscribe({
      next: (fullProgram) => {
        let dialogData: StudijskiProgramDialogData = {
          studijskiProgram: fullProgram,
          isEdit: true
        };

        let dialogRef = this.dialog.open(StudijskiProgramDialogComponent, {
          width: '500px',
          data: dialogData
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.loadStudijskiProgrami();
          }
        });
      },
      error: (error) => {
        alert('Greška pri učitavanju podataka za izmenu.');
      }
    });
  }

  onObrisi(studijskiProgram: any): void {
    if (confirm(`Da li ste sigurni da želite da obrišete studijski program "${studijskiProgram.naziv}"?`)) {
      this.studijskiProgramService.delete(studijskiProgram.id).subscribe({
        next: () => {
          alert('Studijski program je uspešno obrisan.');
          this.loadStudijskiProgrami();
        },
        error: (error) => {
          console.error('Greška pri brisanju studijskog programa:', error);
          alert('Greška pri brisanju studijskog programa. Možda postoje povezani podaci.');
        }
      });
    }
  }

  onPrikazi(studijskiProgram: any): void {
    if (studijskiProgram && studijskiProgram.id) {
      this.router.navigate(['/studijski-programi', studijskiProgram.id], {
        queryParams: { from: 'admin' }
      });
    }
  }

  onDodajNovi(): void {
    let dialogData: StudijskiProgramDialogData = {
      studijskiProgram: undefined,
      isEdit: false
    };

    let dialogRef = this.dialog.open(StudijskiProgramDialogComponent, {
      width: '500px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadStudijskiProgrami();
      }
    });
  }
}
