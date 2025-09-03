import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { Drzava } from '../../models/drzava';
import { DrzavaRdfService } from '../../services/drzava/drzava-rdf.service';
import { GenericTableComponent, TableColumn, TableAction } from '../generic-table/generic-table.component';
import { GenericDialogComponent } from '../generic-dialog/generic-dialog.component';

@Component({
  selector: 'app-drzava-rdf-table',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSnackBarModule,
    FormsModule,
    GenericTableComponent
  ],
  template: `
    <div class="drzava-rdf-container">
      <div class="header-section">
        <h1 class="page-title">RDF Upravljanje Državama</h1>
        <div class="header-actions">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Pretraži po nazivu</mat-label>
            <input matInput [(ngModel)]="searchTerm" (input)="onSearchChange()" placeholder="Unesite naziv države">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
          <button mat-raised-button color="primary" (click)="addDrzava()" class="add-button">
            <mat-icon>add</mat-icon>
            Dodaj Državu (RDF)
          </button>
        </div>
      </div>

      <mat-card class="table-card">
        <mat-card-content>
          <div *ngIf="loading" class="loading-container">
            <p>Učitavanje država iz RDF skladišta...</p>
          </div>

          <div *ngIf="!loading && drzave.length === 0" class="no-data-container">
            <mat-icon class="no-data-icon">public</mat-icon>
            <p class="no-data-text">Nema država u RDF skladištu</p>
          </div>

          <app-generic-table 
            *ngIf="!loading && drzave.length > 0"
            [data]="drzave" 
            [columns]="columns"
            [actions]="actions"
            [rowClickable]="false"
            [showDownloadButton]="false">
          </app-generic-table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styleUrls: ['./drzava-rdf-table.component.css']
})
export class DrzavaRdfTableComponent implements OnInit {
  drzave: Drzava[] = [];
  loading = false;
  searchTerm = '';

  columns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'naziv', label: 'Naziv' }
  ];

  actions: TableAction[] = [
    {
      label: 'Uredi',
      color: 'primary',
      action: (drzava: Drzava) => this.editDrzava(drzava)
    },
    {
      label: 'Obriši',
      color: 'warn',
      action: (drzava: Drzava) => this.deleteDrzava(drzava)
    }
  ];

  constructor(
    private drzavaRdfService: DrzavaRdfService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDrzave();
  }

  loadDrzave(): void {
    this.loading = true;
    this.drzavaRdfService.getAllDrzave().subscribe({
      next: (data) => {
        this.drzave = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Greška pri učitavanju država iz RDF:', error);
        this.snackBar.open('Greška pri učitavanju država iz RDF skladišta', 'Zatvori', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onSearchChange(): void {
    if (this.searchTerm.trim() === '') {
      this.loadDrzave();
    } else {
      this.loading = true;
      this.drzavaRdfService.searchDrzaveByNaziv(this.searchTerm).subscribe({
        next: (data) => {
          this.drzave = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Greška pri pretrazi država:', error);
          this.snackBar.open('Greška pri pretrazi država', 'Zatvori', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }

  addDrzava(): void {
    const dialogRef = this.dialog.open(GenericDialogComponent, {
      width: '450px',
      maxHeight: '400px',
      data: {
        title: 'Dodaj novu državu (RDF)',
        fields: [
          { name: 'naziv', label: 'Naziv', type: 'text', required: true }
        ]
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.drzavaRdfService.createDrzava(result).subscribe({
          next: () => {
            this.snackBar.open('Država je uspešno dodana u RDF skladište', 'Zatvori', { duration: 3000 });
            this.loadDrzave();
          },
          error: (error) => {
            console.error('Greška pri dodavanju države:', error);
            this.snackBar.open('Greška pri dodavanju države', 'Zatvori', { duration: 3000 });
          }
        });
      }
    });
  }

  editDrzava(drzava: Drzava): void {
    const dialogRef = this.dialog.open(GenericDialogComponent, {
      width: '450px',
      maxHeight: '400px',
      data: {
        title: 'Uredi državu (RDF)',
        fields: [
          { name: 'naziv', label: 'Naziv', type: 'text', required: true }
        ],
        data: { naziv: drzava.naziv }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && drzava.id) {
        this.drzavaRdfService.updateDrzava(drzava.id, result).subscribe({
          next: () => {
            this.snackBar.open('Država je uspešno ažurirana u RDF skladištu', 'Zatvori', { duration: 3000 });
            this.loadDrzave();
          },
          error: (error) => {
            console.error('Greška pri ažuriranju države:', error);
            this.snackBar.open('Greška pri ažuriranju države', 'Zatvori', { duration: 3000 });
          }
        });
      }
    });
  }

  deleteDrzava(drzava: Drzava): void {
    if (confirm(`Da li ste sigurni da želite da obrišete državu "${drzava.naziv}" iz RDF skladišta?`)) {
      if (drzava.id) {
        this.drzavaRdfService.deleteDrzava(drzava.id).subscribe({
          next: () => {
            this.snackBar.open('Država je uspešno obrisana iz RDF skladišta', 'Zatvori', { duration: 3000 });
            this.loadDrzave();
          },
          error: (error) => {
            console.error('Greška pri brisanju države:', error);
            this.snackBar.open('Greška pri brisanju države', 'Zatvori', { duration: 3000 });
          }
        });
      }
    }
  }
}
