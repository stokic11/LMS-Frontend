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

  actions: TableAction[] = [
    {
      label: 'Prikaži',
      icon: 'visibility',
      color: 'primary',
      action: (item: any) => this.onPrikazi(item)
    },
    {
      label: 'Izmeni',
      icon: 'edit',
      color: 'accent',
      action: (item: any) => this.onIzmeni(item)
    },
    {
      label: 'Obriši',
      icon: 'delete',
      color: 'warn',
      action: (item: any) => this.onObrisi(item)
    }
  ];

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
        console.log('Podaci iz baze sa detaljima:', data);
        this.studijskiProgramiDisplay = data.map(sp => ({
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

  onRowClick(row: any): void {
    // Disable row click for admin table since we'll use action buttons
  }

  onDodaj(): void {
    const dialogData: StudijskiProgramDialogData = {
      isEdit: false
    };

    const dialogRef = this.dialog.open(StudijskiProgramDialogComponent, {
      width: '500px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Kreiran novi studijski program:', result);
        this.loadStudijskiProgrami(); // Reload data
      }
    });
  }

  onIzmeni(studijskiProgram: any): void {
    // Load full studijski program data first
    this.studijskiProgramService.getById(studijskiProgram.id).subscribe({
      next: (fullProgram) => {
        const dialogData: StudijskiProgramDialogData = {
          studijskiProgram: fullProgram,
          isEdit: true
        };

        const dialogRef = this.dialog.open(StudijskiProgramDialogComponent, {
          width: '500px',
          data: dialogData
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            console.log('Ažuriran studijski program:', result);
            this.loadStudijskiProgrami(); // Reload data
          }
        });
      },
      error: (error) => {
        console.error('Greška pri učitavanju studijskog programa za izmenu:', error);
        alert('Greška pri učitavanju podataka za izmenu.');
      }
    });
  }

  onObrisi(studijskiProgram: any): void {
    if (confirm(`Da li ste sigurni da želite da obrišete studijski program "${studijskiProgram.naziv}"?`)) {
      this.studijskiProgramService.delete(studijskiProgram.id).subscribe({
        next: () => {
          console.log('Studijski program je uspešno obrisan');
          alert('Studijski program je uspešno obrisan.');
          this.loadStudijskiProgrami(); // Reload data
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
      this.router.navigate(['/studijski-programi', studijskiProgram.id]);
    }
  }
}
