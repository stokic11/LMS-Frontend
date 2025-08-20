import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Korisnik } from '../../models/korisnik';

@Component({
  selector: 'app-korisnik-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './korisnik-edit-dialog.component.html',
  styleUrl: './korisnik-edit-dialog.component.css'
})
export class KorisnikEditDialogComponent implements OnInit {
  korisnikForm: FormGroup;
  isNew: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<KorisnikEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isNew = data.isNew || false;
    this.korisnikForm = this.fb.group({
      id: [data.id || null],
      korisnickoIme: [data.korisnickoIme || '', [Validators.required]],
      email: [data.email || '', [Validators.required, Validators.email]],
      ime: [data.ime || '', [Validators.required]],
      prezime: [data.prezime || '', [Validators.required]],
      datumRodjenja: [data.datumRodjenja || null]
    });

    // Add password field only for new users
    if (this.isNew) {
      this.korisnikForm.addControl('lozinka', this.fb.control('', [Validators.required, Validators.minLength(6)]));
    }
  }

  ngOnInit(): void {}

  onSave(): void {
    if (this.korisnikForm.valid) {
      const formValue = this.korisnikForm.value;
      
      // Remove datumRodjenja as backend doesn't support it yet
      if (formValue.datumRodjenja !== undefined) {
        delete formValue.datumRodjenja;
      }
      
      // For new users, ensure lozinka is included
      // For edit users, don't include lozinka if it's empty or undefined
      if (!this.isNew && (formValue.lozinka === undefined || formValue.lozinka === null || formValue.lozinka === '')) {
        delete formValue.lozinka;
      }
      
      // Ensure required fields are not null/undefined
      if (!formValue.ime) formValue.ime = '';
      if (!formValue.prezime) formValue.prezime = '';
      
      console.log('Form value being sent:', formValue);
      this.dialogRef.close(formValue);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  get title(): string {
    return this.isNew ? 'Dodaj Novog Korisnika' : 'Izmeni Korisnika';
  }
}
