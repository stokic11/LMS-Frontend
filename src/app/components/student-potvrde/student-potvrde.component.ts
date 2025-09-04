import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PotvrdaService } from '../../services/potvrda/potvrda.service';
import { TipPotvrdaService } from '../../services/tip-potvrda/tip-potvrda.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { Potvrda, TipPotvrde } from '../../models/potvrda';
import { GenericTableComponent, TableColumn, TableAction } from '../generic-table/generic-table.component';
import { GenericDialogComponent } from '../generic-dialog/generic-dialog.component';
import { DialogConfig, FieldConfig } from '../generic-dialog/field-config.interface';

@Component({
  selector: 'app-student-potvrde',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    GenericTableComponent
  ],
  templateUrl: './student-potvrde.component.html',
  styleUrls: ['./student-potvrde.component.css']
})
export class StudentPotvrdaComponent implements OnInit {
  potvrde: any[] = [];
  odobrernePotvrde: Potvrda[] = [];
  tipovePotvrda: TipPotvrde[] = [];
  loading = false;
  currentStudentId: number | null = null;

  
  columns: TableColumn[] = [
    { key: 'tipPotvrdaNaziv', label: 'Tip potvrde' },
    { key: 'datumIzdanja', label: 'Datum zahteva' },
    { key: 'odobreno', label: 'Status' }
  ];

  approvedColumns: TableColumn[] = [
    { key: 'tipPotvrdaNaziv', label: 'Tip potvrde' },
    { key: 'datumIzdanja', label: 'Datum odobrenja' },
    { key: 'status', label: 'Status' }
  ];

  constructor(
    private potvrdaService: PotvrdaService,
    private tipPotvrdaService: TipPotvrdaService,
    private authService: AuthenticationService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getCurrentStudentId();
    this.loadTipovePotvrda();
    this.loadPotvrde();
  }

  getCurrentStudentId(): void {
    const userInfo = this.authService.getCurrentUser();
    if (userInfo) {
      this.currentStudentId = userInfo.id;
    }
  }

  loadTipovePotvrda(): void {
    this.tipPotvrdaService.getAllTipovi().subscribe({
      next: (data) => {
        this.tipovePotvrda = data;
      },
      error: (error) => {
      }
    });
  }

  loadPotvrde(): void {
    if (this.currentStudentId) {
      this.loading = true;
      this.potvrdaService.getPotvrdaByStudentId(this.currentStudentId).subscribe({
        next: (data) => {
          this.potvrde = data.map(p => ({
            ...p,
            odobreno: p.odobreno ? 'Odobreno' : 'Na čekanju'
          }));
          this.odobrernePotvrde = data
            .filter(p => p.odobreno === true)
            .map(p => ({
              ...p,
              status: 'Odobrena - Posetite studentsku službu za preuzimanje'
            }));
          this.loading = false;
        },
        error: (error) => {
          this.snackBar.open('Greška pri učitavanju potvrda', 'Zatvori', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }

  openCreateDialog(): void {
    const dialogConfig: DialogConfig = {
      title: 'Zatraži potvrdu',
      fields: [
        {
          name: 'tipPotvrdaId',
          label: 'Tip potvrde',
          type: 'select',
          required: true,
          options: this.tipovePotvrda.map(tip => ({ value: tip.id, label: tip.naziv }))
        }
      ],
      isNew: true,
      customSave: (data: any) => {
        return new Promise((resolve, reject) => {
          this.potvrdaService.createPotvrda(this.currentStudentId!, data.tipPotvrdaId).subscribe({
            next: (result) => {
              this.snackBar.open('Zahtev za potvrdu je uspešno poslat', 'Zatvori', { duration: 3000 });
              this.loadPotvrde();
              resolve(result);
            },
            error: (error) => {
              this.snackBar.open('Greška pri slanju zahteva', 'Zatvori', { duration: 3000 });
              reject(error);
            }
          });
        });
      }
    };

    this.dialog.open(GenericDialogComponent, {
      width: '400px',
      data: dialogConfig
    });
  }
}
