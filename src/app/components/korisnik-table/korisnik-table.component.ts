import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Korisnik } from '../../models/korisnik';
import { Student } from '../../models/student';
import { Nastavnik } from '../../models/nastavnik';
import { Uloga } from '../../models/uloga';
import { KorisnikService } from '../../services/korisnik/korisnik.service';
import { StudentService } from '../../services/student/student.service';
import { NastavnikService } from '../../services/nastavnik/nastavnik.service';
import { UlogaService } from '../../services/uloga/uloga.service';
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
    MatProgressSpinnerModule,
    GenericTableComponent
  ],
  templateUrl: './korisnik-table.component.html',
  styleUrl: './korisnik-table.component.css'
})
export class KorisnikTableComponent implements OnInit {
  korisnici: Korisnik[] = [];
  studenti: Student[] = [];
  nastavnici: Nastavnik[] = [];
  uloge: Uloga[] = [];
  ulogaMap: Map<number, string> = new Map();
  loading = false;

  
  korisniciColumns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'korisnickoIme', label: 'Korisničko ime' },
    { key: 'email', label: 'Email' },
    { key: 'ime', label: 'Ime' },
    { key: 'prezime', label: 'Prezime' },
    { key: 'uloga', label: 'Uloga' }
  ];

  
  studentiColumns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'ime', label: 'Ime' },
    { key: 'prezime', label: 'Prezime' },
    { key: 'email', label: 'Email' },
    { key: 'korisnickoIme', label: 'Korisničko ime' },
    { key: 'jmbg', label: 'JMBG' }
  ];

  
  nastavniciColumns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'ime', label: 'Ime' },
    { key: 'prezime', label: 'Prezime' },
    { key: 'email', label: 'Email' },
    { key: 'korisnickoIme', label: 'Korisničko ime' },
    { key: 'jmbg', label: 'JMBG' }
  ];

  
  korisniciActions: TableAction[] = [
    {
      label: 'Obriši',
      color: 'warn',
      action: (korisnik: Korisnik) => this.deleteKorisnik(korisnik)
    }
  ];

  constructor(
    private korisnikService: KorisnikService,
    private studentService: StudentService,
    private nastavnikService: NastavnikService,
    private ulogaService: UlogaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUloge();
  }

  loadUloge(): void {
    this.ulogaService.getAll().subscribe({
      next: (uloge) => {
        this.uloge = uloge;
        this.ulogaMap.clear();
        uloge.forEach(uloga => {
          if (uloga.id) {
            this.ulogaMap.set(uloga.id, uloga.naziv);
          }
        });
        this.loadAllUserData();
      },
      error: (error) => {
        console.error('Error loading roles:', error);
        this.snackBar.open('Greška pri učitavanju uloga', 'Zatvori', { duration: 3000 });
        this.loadAllUserData(); 
      }
    });
  }

  loadAllUserData(): void {
    this.loading = true;
    
    
    this.korisnikService.getAll().subscribe({
      next: (korisnici) => {
        console.log('Osnovni korisnici:', korisnici);
        
        this.korisnici = korisnici
          .filter(korisnik => !korisnik.obrisan)
          .map(korisnik => ({
            ...korisnik,
            uloga: this.ulogaMap.get(korisnik.ulogaId || 0) || 'Nepoznata uloga'
          }));
        this.checkLoadingComplete();
      },
      error: (error) => {
        console.error('Error loading basic users:', error);
        this.snackBar.open('Greška pri učitavanju korisnika', 'Zatvori', { duration: 3000 });
        this.korisnici = [];
        this.checkLoadingComplete();
      }
    });

    
    this.studentService.getAll().subscribe({
      next: (studenti) => {
        console.log('Studenti iz student tabele:', studenti);
        this.studenti = studenti.filter(student => !student.obrisan);
        this.checkLoadingComplete();
      },
      error: (error) => {
        console.error('Error loading students:', error);
        this.snackBar.open('Greška pri učitavanju studenata', 'Zatvori', { duration: 3000 });
        this.studenti = [];
        this.checkLoadingComplete();
      }
    });

    
    this.nastavnikService.getAll().subscribe({
      next: (nastavnici) => {
        console.log('Nastavnici iz nastavnik tabele:', nastavnici);
        this.nastavnici = nastavnici.filter(nastavnik => !nastavnik.obrisan);
        this.checkLoadingComplete();
      },
      error: (error) => {
        console.error('Error loading teachers:', error);
        this.snackBar.open('Greška pri učitavanju nastavnika', 'Zatvori', { duration: 3000 });
        this.nastavnici = [];
        this.checkLoadingComplete();
      }
    });
  }

  private loadingStates = {
    korisnici: false,
    studenti: false,
    nastavnici: false
  };

  checkLoadingComplete(): void {
    
    if (this.korisnici !== undefined) this.loadingStates.korisnici = true;
    if (this.studenti !== undefined) this.loadingStates.studenti = true;
    if (this.nastavnici !== undefined) this.loadingStates.nastavnici = true;

    
    if (this.loadingStates.korisnici && this.loadingStates.studenti && this.loadingStates.nastavnici) {
      this.loading = false;
    }
  }

  onRowClick(item: any): void {
    console.log('Row clicked:', item);
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
    this.korisnikService.patch(korisnik.id!, korisnik).subscribe({
      next: () => {
        this.snackBar.open('Korisnik je uspešno ažuriran', 'Zatvori', { duration: 3000 });
        this.loadUloge();
      },
      error: (error) => {
        console.error('Error updating user:', error);
        this.snackBar.open('Greška pri ažuriranju korisnika', 'Zatvori', { duration: 3000 });
      }
    });
  }

  deleteKorisnik(korisnik: Korisnik): void {
    if (confirm(`Da li ste sigurni da želite da obrišete korisnika ${korisnik.korisnickoIme}?`)) {
      this.korisnikService.delete(korisnik.id!).subscribe({
        next: () => {
          this.snackBar.open('Korisnik je uspešno obrisan', 'Zatvori', { duration: 3000 });
          this.loadAllUserData();
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
        this.loadUloge();
      },
      error: (error) => {
        console.error('Error creating user:', error);
        this.snackBar.open('Greška pri kreiranju korisnika', 'Zatvori', { duration: 3000 });
      }
    });
  }
}
