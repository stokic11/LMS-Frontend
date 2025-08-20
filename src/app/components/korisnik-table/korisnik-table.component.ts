import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Korisnik } from '../../models/korisnik';
import { KorisnikService } from '../../services/korisnik/korisnik.service';
import { KorisnikEditDialogComponent } from '../korisnik-edit-dialog/korisnik-edit-dialog.component';
import { GenericTableComponent, TableColumn, TableAction } from '../generic-table/generic-table.component';

@Component({
  selector: 'app-korisnik-table',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatCardModule, 
    MatIconModule, 
    MatDialogModule,
    MatSnackBarModule,
    GenericTableComponent
  ],
  templateUrl: './korisnik-table.component.html',
  styleUrl: './korisnik-table.component.css'
})
export class KorisnikTableComponent implements OnInit {
  korisnici: Korisnik[] = [];
  loading = false;

  columns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'korisnickoIme', label: 'Korisničko ime' },
    { key: 'email', label: 'Email' },
    { key: 'ime', label: 'Ime' },
    { key: 'prezime', label: 'Prezime' }
  ];

  actions: TableAction[] = [
    {
      label: 'Izmeni',
      color: 'primary',
      action: (korisnik: Korisnik) => this.editKorisnik(korisnik)
    },
    {
      label: 'Obriši',
      color: 'warn',
      action: (korisnik: Korisnik) => this.deleteKorisnik(korisnik)
    }
  ];

  constructor(
    private korisnikService: KorisnikService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadKorisnici();
  }

  loadKorisnici(): void {
    this.loading = true;
    this.korisnikService.getAll().subscribe({
      next: (data) => {
        this.korisnici = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.snackBar.open('Greška pri učitavanju korisnika', 'Zatvori', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onRowClick(korisnik: Korisnik): void {
    
    console.log('Row clicked:', korisnik);
  }

  editKorisnik(korisnik: Korisnik): void {
    const dialogRef = this.dialog.open(KorisnikEditDialogComponent, {
      width: '600px',
      data: { ...korisnik }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateKorisnik(result);
      }
    });
  }

  updateKorisnik(korisnik: Korisnik): void {
    console.log('Sending korisnik for update:', korisnik);
    this.korisnikService.patch(korisnik.id!, korisnik).subscribe({
      next: (response) => {
        console.log('Update response:', response);
        this.snackBar.open('Korisnik je uspešno ažuriran', 'Zatvori', { duration: 3000 });
        this.loadKorisnici();
      },
      error: (error) => {
        console.error('Error updating user:', error);
        console.error('Error details:', error.error);
        this.snackBar.open('Greška pri ažuriranju korisnika: ' + (error.error?.message || error.message), 'Zatvori', { duration: 5000 });
      }
    });
  }

  deleteKorisnik(korisnik: Korisnik): void {
    if (confirm(`Da li ste sigurni da želite da obrišete korisnika ${korisnik.korisnickoIme}?`)) {
      this.korisnikService.delete(korisnik.id!).subscribe({
        next: () => {
          this.snackBar.open('Korisnik je uspešno obrisan', 'Zatvori', { duration: 3000 });
          this.loadKorisnici();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.snackBar.open('Greška pri brisanju korisnika', 'Zatvori', { duration: 3000 });
        }
      });
    }
  }

  addKorisnik(): void {
    const dialogRef = this.dialog.open(KorisnikEditDialogComponent, {
      width: '600px',
      data: { isNew: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createKorisnik(result);
      }
    });
  }

  createKorisnik(korisnik: Korisnik): void {
    this.korisnikService.create(korisnik).subscribe({
      next: () => {
        this.snackBar.open('Korisnik je uspešno kreiran', 'Zatvori', { duration: 3000 });
        this.loadKorisnici();
      },
      error: (error) => {
        console.error('Error creating user:', error);
        this.snackBar.open('Greška pri kreiranju korisnika', 'Zatvori', { duration: 3000 });
      }
    });
  }
}
