import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Student } from '../../models/student';
import { Predmet } from '../../models/predmet';
import { TipEvaluacije } from '../../models/tipEvaluacije';

@Component({
  selector: 'app-nastavnik-ocenjivanje-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './nastavnik-ocenjivanje-dialog.component.html',
  styleUrl: './nastavnik-ocenjivanje-dialog.component.css'
})
export class NastavnikOcenjivanjeDialogComponent {
  bodovi: number;
  napomena: string;
  student: Student;
  brojIndeksa: string;
  predmet: Predmet;
  tipEvaluacije: TipEvaluacije;

  constructor(
    public dialogRef: MatDialogRef<NastavnikOcenjivanjeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      student: Student;
      brojIndeksa: string;
      predmet: Predmet;
      tipEvaluacije: TipEvaluacije;
      trenutniBodovi: number;
      trenutnaNapomena: string;
    }
  ) {
    this.student = data.student;
    this.brojIndeksa = data.brojIndeksa;
    this.predmet = data.predmet;
    this.tipEvaluacije = data.tipEvaluacije;
    this.bodovi = data.trenutniBodovi;
    this.napomena = data.trenutnaNapomena;
  }

  get izracunataOcena(): number {
    if (this.bodovi >= 91) return 10;
    if (this.bodovi >= 81) return 9;
    if (this.bodovi >= 71) return 8;
    if (this.bodovi >= 61) return 7;
    if (this.bodovi >= 51) return 6;
    return 5;
  }

  get statusPolozeno(): string {
    return this.izracunataOcena >= 6 ? 'POLOŽENO' : 'NIJE POLOŽENO';
  }

  get statusColor(): string {
    return this.izracunataOcena >= 6 ? 'green' : 'red';
  }

  onBodoviChange(): void {
    if (this.bodovi < 0) {
      this.bodovi = 0;
    } else if (this.bodovi > 100) {
      this.bodovi = 100;
    }
  }

  get isValidBodovi(): boolean {
    return this.bodovi >= 0 && this.bodovi <= 100 && this.bodovi !== null && this.bodovi !== undefined;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.isValidBodovi) {
      this.dialogRef.close({
        bodovi: this.bodovi,
        napomena: this.napomena
      });
    }
  }
}
