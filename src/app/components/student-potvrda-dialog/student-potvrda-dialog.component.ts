import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PotvrdaService } from '../../services/potvrda/potvrda.service';
import { TipPotvrdaService } from '../../services/tip-potvrda/tip-potvrda.service';
import { TipPotvrde } from '../../models/potvrda';

export interface DialogData {
  studentId: number;
}

@Component({
  selector: 'app-student-potvrda-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule
  ],
  templateUrl: './student-potvrda-dialog.component.html',
  styleUrls: ['./student-potvrda-dialog.component.css']
})
export class StudentPotvrdaDialogComponent implements OnInit {
  selectedTipPotvrdaId: number | null = null;
  tipoviPotvrda: TipPotvrde[] = [];
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<StudentPotvrdaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private potvrdaService: PotvrdaService,
    private tipPotvrdaService: TipPotvrdaService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadTipoviPotvrda();
  }

  loadTipoviPotvrda(): void {
    this.loading = true;
    this.tipPotvrdaService.getAllTipovi().subscribe({
      next: (tipovi) => {
        this.tipoviPotvrda = tipovi;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading tipovi potvrda:', error);
        this.snackBar.open('Greška pri učitavanju tipova potvrda', 'Zatvori', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.selectedTipPotvrdaId) {
      this.potvrdaService.createPotvrda(this.data.studentId, this.selectedTipPotvrdaId).subscribe({
        next: (result) => {
          this.snackBar.open('Zahtev za potvrdu je uspešno poslat', 'Zatvori', { duration: 3000 });
          this.dialogRef.close(result);
        },
        error: (error) => {
          console.error('Error creating potvrda:', error);
          this.snackBar.open('Greška pri slanju zahteva', 'Zatvori', { duration: 3000 });
        }
      });
    } else {
      this.snackBar.open('Molimo izaberite tip potvrde', 'Zatvori', { duration: 3000 });
    }
  }
}
