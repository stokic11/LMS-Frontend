import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { GenericTableComponent, TableColumn, TableAction } from '../generic-table/generic-table.component';
import { GenericDialogComponent } from '../generic-dialog/generic-dialog.component';
import { DialogConfig } from '../generic-dialog/field-config.interface';
import { DialogConfigService } from '../generic-dialog/dialog-config.service';
import { IzdataKnjiga } from '../../models/izdata-knjiga.model';
import { Biblioteka } from '../../models/biblioteka.model';
import { Knjiga } from '../../models/knjiga.model';
import { IzdataKnjigaService } from '../../services/izdata-knjiga/izdata-knjiga.service';
import { BibliotekaService } from '../../services/biblioteka/biblioteka.service';
import { KnjigaService } from '../../services/knjiga/knjiga.service';
import { StudentService } from '../../services/student/student.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-literatura',
  standalone: true,
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    GenericTableComponent
  ],
  templateUrl: './literatura.component.html',
  styleUrls: ['./literatura.component.css']
})
export class LiteraturaComponent implements OnInit {
  
  loading = true;
  zahtevi: any[] = [];
  neodobreniZahtevi: any[] = [];
  odobreniZahtevi: any[] = [];
  biblioteka: any[] = [];
  
  columns: TableColumn[] = [
    { key: 'imeStudenta', label: 'Ime studenta' },
    { key: 'prezimeStudenta', label: 'Prezime studenta' },
    { key: 'emailStudenta', label: 'Email' },
    { key: 'nazivKnjige', label: 'Naziv knjige' },
    { key: 'autorKnjige', label: 'Autor' },
    { key: 'odobreno', label: 'Status' }
  ];

  neodobreniColumns: TableColumn[] = [
    { key: 'imeStudenta', label: 'Ime studenta' },
    { key: 'prezimeStudenta', label: 'Prezime studenta' },
    { key: 'emailStudenta', label: 'Email' },
    { key: 'nazivKnjige', label: 'Naziv knjige' },
    { key: 'autorKnjige', label: 'Autor' }
  ];

  odobreniColumns: TableColumn[] = [
    { key: 'imeStudenta', label: 'Ime studenta' },
    { key: 'prezimeStudenta', label: 'Prezime studenta' },
    { key: 'emailStudenta', label: 'Email' },
    { key: 'nazivKnjige', label: 'Naziv knjige' },
    { key: 'autorKnjige', label: 'Autor' }
  ];

  bibliotekaColumns: TableColumn[] = [
    { key: 'nazivKnjige', label: 'Naziv knjige' },
    { key: 'autorKnjige', label: 'Autor' },
    { key: 'brojPrimeraka', label: 'Broj primeraka' }
  ];
  
  actions: TableAction[] = [
    {
      label: 'Odobri',
      icon: 'check',
      color: 'primary',
      action: (item: any) => this.odobriZahtev(item)
    },
    {
      label: 'Odbaci',
      icon: 'close',
      color: 'warn',
      action: (item: any) => this.odbaci(item)
    }
  ];

  pendingActions: TableAction[] = [
    {
      label: 'Odobri',
      icon: 'check',
      color: 'primary',
      action: (item: any) => this.odobriZahtev(item)
    },
    {
      label: 'Odbaci',
      icon: 'close',
      color: 'warn',
      action: (item: any) => this.odbaci(item)
    }
  ];

  approvedActions: TableAction[] = [
  ];

  bibliotekaActions: TableAction[] = [
    {
      label: 'Dodaj primerke',
      icon: 'add',
      color: 'primary',
      action: (item: any) => this.dodajPrimerke(item)
    }
  ];
  
  constructor(
    private izdataKnjigaService: IzdataKnjigaService,
    private bibliotekaService: BibliotekaService,
    private studentService: StudentService,
    private knjigaService: KnjigaService,
    private dialogConfigService: DialogConfigService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}
  
  ngOnInit(): void {
    this.loading = true;
    this.loadZahtevi();
    this.loadBiblioteka();
  }
  
  loadZahtevi(): void {
    this.izdataKnjigaService.getAll().subscribe({
      next: (data: IzdataKnjiga[]) => {

        const studentRequests = data.map(zahtev => 
          this.studentService.getById(zahtev.studentId)
        );
        
        if (studentRequests.length === 0) {
          this.zahtevi = [];
          this.neodobreniZahtevi = [];
          this.loading = false;
          return;
        }
        
        forkJoin(studentRequests).subscribe({
          next: (studenti) => {
            this.zahtevi = data.map((zahtev, index) => {
              const student = studenti[index];
              return {
                ...zahtev,
                imeStudenta: student?.ime || 'Nepoznato',
                prezimeStudenta: student?.prezime || 'Nepoznato',
                emailStudenta: student?.email || 'Nepoznat email',
                nazivKnjige: zahtev.knjiga?.naziv || 'Nepoznato',
                autorKnjige: zahtev.knjiga?.autor || 'Nepoznat autor',
                odobreno: zahtev.odobreno ? 'Odobreno' : 'Na čekanju',
                odobreno_boolean: zahtev.odobreno
              };
            });
            this.neodobreniZahtevi = this.zahtevi.filter(z => !z.odobreno_boolean);
            this.odobreniZahtevi = this.zahtevi.filter(z => z.odobreno_boolean);
            this.loading = false;
          },
          error: (error: any) => {
            console.error('Greška pri učitavanju studenata:', error);
            this.zahtevi = data.map(zahtev => ({
              ...zahtev,
              imeStudenta: 'Nepoznato',
              prezimeStudenta: 'Nepoznato', 
              emailStudenta: 'Nepoznat email',
              nazivKnjige: zahtev.knjiga?.naziv || 'Nepoznato',
              autorKnjige: zahtev.knjiga?.autor || 'Nepoznat autor',
              odobreno: zahtev.odobreno ? 'Odobreno' : 'Na čekanju',
              odobreno_boolean: zahtev.odobreno
            }));
            this.neodobreniZahtevi = this.zahtevi.filter(z => !z.odobreno_boolean);
            this.odobreniZahtevi = this.zahtevi.filter(z => z.odobreno_boolean);
            this.loading = false;
          }
        });
      },
      error: (error: any) => {
        console.error('Greška pri učitavanju zahteva:', error);
        this.snackBar.open('Greška pri učitavanju zahteva', 'Zatvori', { duration: 3000 });
        this.loading = false;
      }
    });
  }
  
  odobriZahtev(zahtev: any): void {
    if (zahtev.odobreno_boolean) {
      this.snackBar.open('Zahtev je već odobren', 'Zatvori', { duration: 3000 });
      return;
    }
    
    if (zahtev.id) {
      this.izdataKnjigaService.odobri(zahtev.id).subscribe({
        next: () => {
          this.snackBar.open('Zahtev je odobren', 'Zatvori', { duration: 3000 });
          this.loadZahtevi();
        },
        error: (error: any) => {
          this.snackBar.open('Greška pri odobravanju zahteva', 'Zatvori', { duration: 3000 });
          console.error('Greška:', error);
        }
      });
    }
  }
  
  odbaci(zahtev: any): void {
    if (zahtev.id) {
      this.izdataKnjigaService.delete(zahtev.id).subscribe({
        next: () => {
          this.snackBar.open('Zahtev je obrisam', 'Zatvori', { duration: 3000 });
          this.loadZahtevi();
        },
        error: (error: any) => {
          this.snackBar.open('Greška pri brisanju zahteva', 'Zatvori', { duration: 3000 });
          console.error('Greška:', error);
        }
      });
    }
  }

  loadBiblioteka(): void {
    this.bibliotekaService.getAll().subscribe({
      next: (data: Biblioteka[]) => {
        this.biblioteka = data.map(item => ({
          ...item,
          nazivKnjige: item.knjiga?.naziv || 'Nepoznato',
          autorKnjige: item.knjiga?.autor || 'Nepoznat autor'
        }));
      },
      error: (error: any) => {
        console.error('Greška pri učitavanju biblioteke:', error);
        this.snackBar.open('Greška pri učitavanju biblioteke', 'Zatvori', { duration: 3000 });
      }
    });
  }

  dodajPrimerke(item: any): void {
    const dialogConfig: DialogConfig = {
      title: 'Dodaj primerke knjige',
      subtitle: `${item.nazivKnjige} - ${item.autorKnjige}`,
      icon: 'add',
      isNew: true,
      fields: [
        {
          name: 'brojPrimeraka',
          label: 'Broj primeraka za dodavanje',
          type: 'number',
          required: true,
          min: 1,
          placeholder: 'Unesite broj primeraka'
        }
      ],
      data: {
        brojPrimeraka: 1
      }
    };

    const dialogRef = this.dialog.open(GenericDialogComponent, {
      width: '400px',
      data: dialogConfig
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.brojPrimeraka > 0) {
        this.dodajPrimerkeBiblioteke(item.id, result.brojPrimeraka);
      }
    });
  }

  dodajPrimerkeBiblioteke(bibliotekaId: number, brojPrimeraka: number): void {
    this.bibliotekaService.dodajPrimerke(bibliotekaId, brojPrimeraka).subscribe({
      next: () => {
        this.snackBar.open(`Dodano je ${brojPrimeraka} primeraka`, 'Zatvori', { duration: 3000 });
        this.loadBiblioteka();
      },
      error: (error: any) => {
        this.snackBar.open('Greška pri dodavanju primeraka', 'Zatvori', { duration: 3000 });
        console.error('Greška:', error);
      }
    });
  }

  dodajKnjigu(): void {
    const config = this.dialogConfigService.getKnjigaConfig(null, true);
    
    const dialogRef = this.dialog.open(GenericDialogComponent, {
      width: '500px',
      data: config
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        
        this.knjigaService.create(result).subscribe({
          next: (createdKnjiga: Knjiga) => {
            
            const bibliotekaEntry: Biblioteka = {
              knjigaId: createdKnjiga.id!,
              brojPrimeraka: 0
            };
            
            this.bibliotekaService.create(bibliotekaEntry).subscribe({
              next: (createdBiblioteka) => {
                this.snackBar.open('Knjiga je uspešno dodana u biblioteku sa 0 primeraka!', 'Zatvori', { duration: 3000 });
                this.loadBiblioteka();
              },
              error: (error: any) => {
                console.error('Greška pri kreiranju biblioteka entry:', error);
                this.snackBar.open('Knjiga je kreirana, ali greška pri dodavanju u biblioteku', 'Zatvori', { duration: 3000 });
                this.loadBiblioteka();
              }
            });
          },
          error: (error: any) => {
            console.error('Greška pri kreiranju knjige:', error);
            this.snackBar.open('Greška pri dodavanju knjige', 'Zatvori', { duration: 3000 });
          }
        });
      }
    });
  }
}
