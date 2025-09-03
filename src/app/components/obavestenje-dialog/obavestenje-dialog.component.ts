import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';

import { ObavestenjeService } from '../../services/obavestenje/obavestenje.service';
import { Obavestenje } from '../../models/obavestenje';
import { NastavnikService } from '../../services/nastavnik/nastavnik.service';
import { NastavnikNaRealizacijiService } from '../../services/nastavnikNaRealizaciji/nastavnik-na-realizaciji.service';
import { RealizacijaPredmetaService } from '../../services/realizacijaPredmeta/realizacija-predmeta.service';
import { PredmetService } from '../../services/predmet/predmet.service';

@Component({
  selector: 'app-obavestenje-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './obavestenje-dialog.component.html',
  styleUrls: ['./obavestenje-dialog.component.css']
})
export class ObavestenjeDialogComponent implements OnInit {
  obavestenjeForm: FormGroup;
  loading = false;
  
  nastavnici: any[] = [];
  nastavniciNaRealizaciji: any[] = [];
  realizacijePredmeta: any[] = [];
  predmeti: any[] = [];
  
  filteredPredmeti: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ObavestenjeDialogComponent>,
    private obavestenjeService: ObavestenjeService,
    private nastavnikService: NastavnikService,
    private nastavnikNaRealizacijiService: NastavnikNaRealizacijiService,
    private realizacijaPredmetaService: RealizacijaPredmetaService,
    private predmetService: PredmetService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.obavestenjeForm = this.fb.group({
      nastavnikId: ['', Validators.required],
      nastavnikNaRealizacijiId: [{value: '', disabled: true}, Validators.required],
      naslov: ['', Validators.required],
      sadrzaj: ['', Validators.required]
    });
  }

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  async loadData(): Promise<void> {
    try {
      // Load all required data
      const [nastavnici, nastavniciNaRealizaciji, realizacije, predmeti] = await Promise.all([
        firstValueFrom(this.nastavnikService.getAll()),
        firstValueFrom(this.nastavnikNaRealizacijiService.getAll()),
        firstValueFrom(this.realizacijaPredmetaService.getAll()),
        firstValueFrom(this.predmetService.getAll())
      ]);

      this.nastavnici = nastavnici as any[];
      this.nastavniciNaRealizaciji = nastavniciNaRealizaciji as any[];
      this.realizacijePredmeta = realizacije as any[];
      this.predmeti = predmeti as any[];

    } catch (error) {
      console.error('Greška pri učitavanju podataka:', error);
      this.snackBar.open('Greška pri učitavanju podataka', 'Zatvori', { duration: 3000 });
    }
  }

  onNastavnikChange(): void {
    const nastavnikId = this.obavestenjeForm.get('nastavnikId')?.value;
    
    if (nastavnikId) {
      // Reset predmet selection
      this.obavestenjeForm.get('nastavnikNaRealizacijiId')?.setValue('');
      
      // Enable predmet dropdown
      this.obavestenjeForm.get('nastavnikNaRealizacijiId')?.enable();
      
      // Find all nastavnik-na-realizaciji records for this nastavnik
      const nastavnikRealizacije = this.nastavniciNaRealizaciji.filter(nnr => 
        nnr.nastavnikId === nastavnikId
      );
      
      // Get predmeti for these realizacije
      this.filteredPredmeti = nastavnikRealizacije.map(nnr => {
        const realizacija = this.realizacijePredmeta.find(r => r.id === nnr.realizacijaPredmetaId);
        const predmet = this.predmeti.find(p => p.id === realizacija?.predmetId);
        
        return {
          nastavnikNaRealizacijiId: nnr.id,
          predmetNaziv: predmet?.naziv || 'Nepoznat predmet',
          predmetId: predmet?.id
        };
      });
      
    } else {
      this.filteredPredmeti = [];
      this.obavestenjeForm.get('nastavnikNaRealizacijiId')?.setValue('');
      this.obavestenjeForm.get('nastavnikNaRealizacijiId')?.disable();
    }
  }

  async onSave(): Promise<void> {
    if (this.obavestenjeForm.valid) {
      this.loading = true;
      
      try {
        // Koristimo getRawValue() da dobijemo sve vrednosti uključujući disabled polja
        const formValue = this.obavestenjeForm.getRawValue();
        
        // Find realizacija predmeta ID
        const selectedNnr = this.nastavniciNaRealizaciji.find(nnr => 
          nnr.id === formValue.nastavnikNaRealizacijiId
        );
        
        if (!selectedNnr) {
          this.snackBar.open('Greška: Nije pronađen nastavnik na realizaciji', 'Zatvori', { duration: 3000 });
          return;
        }
        
        const obavestenjeData = {
          naslov: formValue.naslov,
          sadrzaj: formValue.sadrzaj,
          vremePostavljanja: new Date(),
          nastavnikNaRealizacijiId: formValue.nastavnikNaRealizacijiId,
          realizacijaPredmetaId: selectedNnr.realizacijaPredmetaId
        };

        const createdObavestenje = await firstValueFrom(this.obavestenjeService.create(obavestenjeData as Obavestenje));
        
        this.snackBar.open('Obaveštenje je uspešno kreirano!', 'Zatvori', { duration: 3000 });
        this.dialogRef.close(true);
        
      } catch (error) {
        console.error('Greška pri kreiranju obaveštenja:', error);
        this.snackBar.open('Greška pri kreiranju obaveštenja', 'Zatvori', { duration: 3000 });
      } finally {
        this.loading = false;
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  isFormValid(): boolean {
    const rawValue = this.obavestenjeForm.getRawValue();
    const isValid = !!(rawValue.nastavnikId && 
             rawValue.nastavnikNaRealizacijiId && 
             rawValue.naslov && 
             rawValue.sadrzaj);
    return isValid;
  }
}
