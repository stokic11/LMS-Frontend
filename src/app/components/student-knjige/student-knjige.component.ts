import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { GenericTableComponent, TableColumn, TableAction } from '../generic-table/generic-table.component';
import { Biblioteka } from '../../models/biblioteka.model';
import { IzdataKnjiga } from '../../models/izdata-knjiga.model';
import { BibliotekaService } from '../../services/biblioteka/biblioteka.service';
import { IzdataKnjigaService } from '../../services/izdata-knjiga/izdata-knjiga.service';

@Component({
  selector: 'app-student-knjige',
  standalone: true,
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    GenericTableComponent
  ],
  templateUrl: './student-knjige.component.html',
  styleUrls: ['./student-knjige.component.css']
})
export class StudentKnjigeComponent implements OnInit {
  
  loading = true;
  dostupneKnjige: Biblioteka[] = [];
  mojeKnjige: any[] = [];
  mojeOdobreneKnjige: any[] = [];
  mojeNeodobreneKnjige: any[] = [];
  
  dostupneKnjigeColumns: TableColumn[] = [
    { key: 'naziv', label: 'Naziv' },
    { key: 'autor', label: 'Autor' },
    { key: 'brojPrimeraka', label: 'Dostupno primeraka' }
  ];
  
  mojeKnjigeColumns: TableColumn[] = [
    { key: 'naziv', label: 'Naziv' },
    { key: 'autor', label: 'Autor' },
    { key: 'status', label: 'Status' }
  ];
  
  dostupneKnjigeActions: TableAction[] = [
    {
      label: 'Traži knjigu',
      icon: 'book',
      color: 'primary',
      action: (item: Biblioteka) => this.traziKnjigu(item)
    }
  ];

  mojeKnjigeActions: TableAction[] = [
    {
      label: 'Vrati',
      icon: 'assignment_return',
      color: 'accent',
      action: (item: any) => this.vratiKnjigu(item)
    }
  ];
  
  constructor(
    private bibliotekaService: BibliotekaService,
    private izdataKnjigaService: IzdataKnjigaService,
    private snackBar: MatSnackBar
  ) {}
  
  ngOnInit(): void {
    this.loading = true;
    this.loadMojeKnjige().then(() => {
      return this.loadDostupneKnjige();
    }).finally(() => {
      this.loading = false;
    });
  }
  
  loadDostupneKnjige(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.bibliotekaService.getAll().subscribe({
        next: (data: Biblioteka[]) => {
          console.log('Biblioteka data:', data);
          this.dostupneKnjige = data.filter(b => {
            const imaPrimeraka = b.brojPrimeraka > 0;
            const vecIma = this.mojeKnjige.some(mk => mk.knjigaId === b.knjigaId);
            return imaPrimeraka && !vecIma;
          }).map(b => ({
            ...b,
            naziv: b.knjiga?.naziv || 'Nepoznato',
            autor: b.knjiga?.autor || 'Nepoznat autor'
          }));
          resolve();
        },
        error: (error: any) => {
          console.error('Greška pri učitavanju knjiga:', error);
          reject(error);
        }
      });
    });
  }
  
  loadMojeKnjige(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.izdataKnjigaService.getMojeKnjige().subscribe({
        next: (data: IzdataKnjiga[]) => {
          this.mojeKnjige = data.map(knjiga => ({
            ...knjiga,
            naziv: knjiga.knjiga?.naziv || 'Nepoznato',
            autor: knjiga.knjiga?.autor || 'Nepoznat autor',
            status: knjiga.odobreno ? 'Odobreno' : 'Na čekanju',
            mozeVratiti: knjiga.odobreno
          }));
          
          this.mojeOdobreneKnjige = this.mojeKnjige.filter(k => k.odobreno);
          this.mojeNeodobreneKnjige = this.mojeKnjige.filter(k => !k.odobreno);
          
          resolve();
        },
        error: (error: any) => {
          console.error('Greška pri učitavanju izdatih knjiga:', error);
          reject(error);
        }
      });
    });
  }
  
  traziKnjigu(biblioteka: Biblioteka): void {
    this.izdataKnjigaService.traziKnjigu(biblioteka.knjigaId).subscribe({
      next: () => {
        this.snackBar.open('Zahtev za knjigom je poslat', 'Zatvori', { duration: 3000 });
        this.loadMojeKnjige().then(() => {
          this.loadDostupneKnjige();
        });
      },
      error: (error: any) => {
        let message = 'Greška pri slanju zahteva';
        if (error.error && error.error.message) {
          message = error.error.message;
        }
        this.snackBar.open(message, 'Zatvori', { duration: 3000 });
        console.error('Greška:', error);
      }
    });
  }

  vratiKnjigu(knjiga: any): void {
    if (!knjiga.odobreno) {
      this.snackBar.open('Možete vratiti samo odobrene knjige', 'Zatvori', { duration: 3000 });
      return;
    }
    
    if (knjiga.id && knjiga.odobreno) {
      this.izdataKnjigaService.vrati(knjiga.id).subscribe({
        next: () => {
          this.snackBar.open('Knjiga je vraćena', 'Zatvori', { duration: 3000 });
          this.loadMojeKnjige().then(() => {
            this.loadDostupneKnjige();
          });
        },
        error: (error: any) => {
          this.snackBar.open('Greška pri vraćanju knjige', 'Zatvori', { duration: 3000 });
          console.error('Greška:', error);
        }
      });
    } else {
      this.snackBar.open('Greška: knjiga nije validna za vraćanje', 'Zatvori', { duration: 3000 });
    }
  }
}
