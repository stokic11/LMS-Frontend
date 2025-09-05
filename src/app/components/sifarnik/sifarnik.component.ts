import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Sifarnik } from '../../models/sifarnik';
import { SifarnikService } from '../../services/sifarnik/sifarnik.service';
import { GenericTableComponent, TableColumn, TableAction } from '../generic-table/generic-table.component';
import { GenericDialogComponent } from '../generic-dialog/generic-dialog.component';
import { DialogConfig, FieldConfig } from '../generic-dialog/field-config.interface';
import { DialogConfigService } from '../generic-dialog/dialog-config.service';

@Component({
  selector: 'app-sifarnik',
  standalone: true,
  imports: [
    CommonModule,
    GenericTableComponent,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './sifarnik.component.html',
  styleUrl: './sifarnik.component.css'
})
export class SifarnikComponent implements OnInit {
  sifarnici: Sifarnik[] = [];
  loading = false;

  columns: TableColumn[] = [
    { key: 'sifra', label: 'Šifra' },
    { key: 'naziv', label: 'Naziv' }
  ];

  actions: TableAction[] = [
    {
      label: 'Izmeni',
      icon: 'edit',
      action: (item: Sifarnik) => this.editSifarnik(item)
    },
    {
      label: 'Obriši',
      icon: 'delete',
      action: (item: Sifarnik) => this.deleteSifarnik(item)
    }
  ];

  constructor(
    private sifarnikService: SifarnikService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private dialogConfigService: DialogConfigService
  ) {}

  ngOnInit(): void {
    this.loadSifarnici();
  }

  loadSifarnici(): void {
    this.loading = true;
    this.sifarnikService.getAll().subscribe({
      next: (data) => {
        this.sifarnici = data.filter(s => !s.obrisan);
        this.loading = false;
      },
      error: (error) => {
        console.error('Greška pri učitavanju šifarnika:', error);
        this.snackBar.open('Greška pri učitavanju šifarnika', 'Zatvori', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  addSifarnik(): void {
    const config: DialogConfig = {
      title: 'Dodaj novi šifarnik',
      fields: [
        {
          name: 'sifra',
          label: 'Šifra',
          type: 'text',
          required: true,
          placeholder: 'Unesite šifru (npr. SII)'
        },
        {
          name: 'naziv',
          label: 'Naziv',
          type: 'text', 
          required: true,
          placeholder: 'Unesite naziv (npr. Softversko Informaciono Inženjerstvo)'
        }
      ]
    };

    let dialogRef = this.dialog.open(GenericDialogComponent, {
      width: '500px',
      data: config
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sifarnikService.create(result).subscribe({
          next: () => {
            this.snackBar.open('Šifarnik je uspešno dodat', 'Zatvori', { duration: 3000 });
            this.loadSifarnici();
          },
          error: (error) => {
            console.error('Greška pri dodavanju šifarnika:', error);
            this.snackBar.open('Greška pri dodavanju šifarnika', 'Zatvori', { duration: 3000 });
          }
        });
      }
    });
  }

  editSifarnik(sifarnik: Sifarnik): void {
    const config: DialogConfig = {
      title: 'Izmeni šifarnik',
      fields: [
        {
          name: 'sifra',
          label: 'Šifra',
          type: 'text',
          required: true
        },
        {
          name: 'naziv',
          label: 'Naziv',
          type: 'text',
          required: true
        }
      ],
      data: { 
        sifra: sifarnik.sifra,
        naziv: sifarnik.naziv
      }
    };

    let dialogRef = this.dialog.open(GenericDialogComponent, {
      width: '500px',
      data: config
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && sifarnik.id) {
        this.sifarnikService.put(sifarnik.id, result).subscribe({
          next: () => {
            this.snackBar.open('Šifarnik je uspešno ažuriran', 'Zatvori', { duration: 3000 });
            this.loadSifarnici();
          },
          error: (error) => {
            console.error('Greška pri ažuriranju šifarnika:', error);
            this.snackBar.open('Greška pri ažuriranju šifarnika', 'Zatvori', { duration: 3000 });
          }
        });
      }
    });
  }

  deleteSifarnik(sifarnik: Sifarnik): void {
    if (confirm(`Da li ste sigurni da želite da obrišete šifarnik "${sifarnik.sifra} - ${sifarnik.naziv}"?`)) {
      if (sifarnik.id) {
        this.sifarnikService.delete(sifarnik.id).subscribe({
          next: () => {
            this.snackBar.open('Šifarnik je uspešno obrisan', 'Zatvori', { duration: 3000 });
            this.loadSifarnici();
          },
          error: (error) => {
            console.error('Greška pri brisanju šifarnika:', error);
            this.snackBar.open('Greška pri brisanju šifarnika', 'Zatvori', { duration: 3000 });
          }
        });
      }
    }
  }
}
