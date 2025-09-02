import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PotvrdaService } from '../../services/potvrda/potvrda.service';
import { Potvrda } from '../../models/potvrda';
import { GenericTableComponent, TableColumn, TableAction } from '../generic-table/generic-table.component';

@Component({
  selector: 'app-dokumentacija-potvrde',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    GenericTableComponent
  ],
  templateUrl: './dokumentacija-potvrde.component.html',
  styleUrls: ['./dokumentacija-potvrde.component.css']
})
export class DokumentacijaPotvrdaComponent implements OnInit {
  pendingPotvrde: Potvrda[] = [];
  approvedPotvrde: Potvrda[] = [];
  loading = false;

  
  pendingColumns: TableColumn[] = [
    { key: 'tipPotvrdaNaziv', label: 'Tip potvrde' },
    { key: 'studentInfo', label: 'Student' },
    { key: 'datumIzdanja', label: 'Datum zahteva', pipe: 'date', pipeArgs: 'dd.MM.yyyy' }
  ];

  approvedColumns: TableColumn[] = [
    { key: 'tipPotvrdaNaziv', label: 'Tip potvrde' },
    { key: 'studentInfo', label: 'Student' },
    { key: 'datumIzdanja', label: 'Datum odobrenja', pipe: 'date', pipeArgs: 'dd.MM.yyyy' },
    { key: 'status', label: 'Status' }
  ];

  pendingActions: TableAction[] = [
    {
      label: 'Odobri',
      icon: 'check',
      color: 'primary',
      action: (potvrda: Potvrda) => this.approvePotvrda(potvrda)
    }
  ];

  constructor(
    private potvrdaService: PotvrdaService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPotvrde();
  }

  loadPotvrde(): void {
    this.loading = true;
    
    
    this.potvrdaService.getPendingPotvrde().subscribe({
      next: (data) => {
        this.pendingPotvrde = data.map(p => ({
          ...p,
          studentInfo: this.getStudentDisplayName(p)
        }));
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading pending potvrde:', error);
        this.snackBar.open('Greška pri učitavanju potvrda na čekanju', 'Zatvori', { duration: 3000 });
        this.loading = false;
      }
    });

    
    this.potvrdaService.getApprovedPotvrde().subscribe({
      next: (data) => {
        this.approvedPotvrde = data.map(p => ({
          ...p,
          studentInfo: this.getStudentDisplayName(p),
          status: 'Odobreno'
        }));
      },
      error: (error) => {
        console.error('Error loading approved potvrde:', error);
        this.snackBar.open('Greška pri učitavanju odobrenih potvrda', 'Zatvori', { duration: 3000 });
      }
    });
  }

  approvePotvrda(potvrda: Potvrda): void {
    if (potvrda.id) {
      this.potvrdaService.approvePotvrda(potvrda.id).subscribe({
        next: (result) => {
          this.snackBar.open(`Potvrda "${potvrda.tipPotvrdaNaziv}" je odobrena`, 'Zatvori', { duration: 3000 });
          this.loadPotvrde();
        },
        error: (error) => {
          console.error('Error approving potvrda:', error);
          this.snackBar.open('Greška pri odobravanju potvrde', 'Zatvori', { duration: 3000 });
        }
      });
    }
  }

  getStudentDisplayName(potvrda: Potvrda): string {
    console.log('Potvrda data:', potvrda);
    if (potvrda.studentIme && potvrda.studentPrezime) {
      return `${potvrda.studentIme} ${potvrda.studentPrezime} (${potvrda.studentKorisnickoIme})`;
    }
    return potvrda.studentKorisnickoIme || 'N/A';
  }
}
