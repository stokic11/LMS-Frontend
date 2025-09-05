import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';

import { ObavestenjeService } from '../../services/obavestenje/obavestenje.service';
import { Obavestenje } from '../../models/obavestenje';
import { NastavnikService } from '../../services/nastavnik/nastavnik.service';
import { NastavnikNaRealizacijiService } from '../../services/nastavnikNaRealizaciji/nastavnik-na-realizaciji.service';
import { RealizacijaPredmetaService } from '../../services/realizacijaPredmeta/realizacija-predmeta.service';
import { PredmetService } from '../../services/predmet/predmet.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { Nastavnik } from '../../models/nastavnik';
import { NastavnikNaRealizaciji } from '../../models/nastavnikNaRealizaciji';
import { RealizacijaPredmeta } from '../../models/realizacijaPredmeta';
import { Predmet } from '../../models/predmet';

interface NastavnikPredmetInfo {
  nastavnikNaRealizacijiId: number;
  predmetNaziv: string;
  predmetId: number;
  realizacijaId: number;
}

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
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './obavestenje-dialog.component.html',
  styleUrls: ['./obavestenje-dialog.component.css']
})
export class ObavestenjeDialogComponent implements OnInit {
  obavestenjeForm: FormGroup;
  loading = false;
  
  nastavnici: Nastavnik[] = [];
  nastavniciNaRealizaciji: NastavnikNaRealizaciji[] = [];
  realizacijePredmeta: RealizacijaPredmeta[] = [];
  predmeti: Predmet[] = [];
  
  filteredPredmeti: NastavnikPredmetInfo[] = [];
  
  isNastavnik = false;
  currentNastavnikId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ObavestenjeDialogComponent>,
    private obavestenjeService: ObavestenjeService,
    private nastavnikService: NastavnikService,
    private nastavnikNaRealizacijiService: NastavnikNaRealizacijiService,
    private realizacijaPredmetaService: RealizacijaPredmetaService,
    private predmetService: PredmetService,
    private authService: AuthenticationService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { obavestenje?: Obavestenje }
  ) {
    this.obavestenjeForm = this.fb.group({
      nastavnikId: ['', Validators.required],
      nastavnikNaRealizacijiId: [{value: '', disabled: true}, Validators.required],
      naslov: ['', Validators.required],
      sadrzaj: ['', Validators.required]
    });
  }

  async ngOnInit(): Promise<void> {
    await this.checkUserRole();
    await this.loadData();
    this.setupFormBasedOnRole();
  }

  async checkUserRole(): Promise<void> {
    let roles = this.authService.getCurrentUserRoles();
    this.isNastavnik = roles.includes('nastavnik') && !roles.includes('studentska_sluzba');
    
    if (this.isNastavnik) {
      let currentUserId = this.authService.getKorisnikId();
      if (currentUserId) {
        try {
          let allNastavnici = await firstValueFrom(this.nastavnikService.getAll());
          let currentNastavnik = allNastavnici.find(n => n.id === currentUserId);
          if (currentNastavnik && currentNastavnik.id) {
            this.currentNastavnikId = currentNastavnik.id;
          } else {
            this.isNastavnik = false; 
          }
        } catch (error) {
          this.isNastavnik = false;
        }
      }
    }
  }

  setupFormBasedOnRole(): void {
    if (this.isNastavnik && this.currentNastavnikId) {
      this.obavestenjeForm.patchValue({
        nastavnikId: this.currentNastavnikId
      });
      
      this.onNastavnikChange();
    }
  }

  async loadData(): Promise<void> {
    try {
      let [nastavnici, nastavniciNaRealizaciji, realizacije, predmeti] = await Promise.all([
        firstValueFrom(this.nastavnikService.getAll()),
        firstValueFrom(this.nastavnikNaRealizacijiService.getAll()),
        firstValueFrom(this.realizacijaPredmetaService.getAll()),
        firstValueFrom(this.predmetService.getAll())
      ]);

      this.nastavnici = nastavnici;
      this.nastavniciNaRealizaciji = nastavniciNaRealizaciji;
      this.realizacijePredmeta = realizacije;
      this.predmeti = predmeti;

    } catch (error) {
      this.snackBar.open('Greška pri učitavanju podataka', 'Zatvori', { duration: 3000 });
    }
  }

  onNastavnikChange(): void {
    let nastavnikId = this.obavestenjeForm.get('nastavnikId')?.value;
    
    if (nastavnikId) {
      this.obavestenjeForm.get('nastavnikNaRealizacijiId')?.setValue('');
      
      this.obavestenjeForm.get('nastavnikNaRealizacijiId')?.enable();
      
      let nastavnikRealizacije = this.nastavniciNaRealizaciji.filter(nnr => 
        nnr.nastavnikId === nastavnikId
      );
      
      let predmetRealizacijaMap = new Map<number, NastavnikPredmetInfo>();
      
      nastavnikRealizacije.forEach(nnr => {
        let realizacija = this.realizacijePredmeta.find(r => r.id === nnr.realizacijaPredmetaId);
        let predmet = this.predmeti.find(p => p.id === realizacija?.predmetId);
        
        if (predmet && realizacija && predmet.id && realizacija.id) {
          let predmetId = predmet.id;
          
          if (!predmetRealizacijaMap.has(predmetId) || 
              realizacija.id > (predmetRealizacijaMap.get(predmetId)?.realizacijaId || 0)) {
            
            predmetRealizacijaMap.set(predmetId, {
              nastavnikNaRealizacijiId: nnr.id!,
              predmetNaziv: predmet.naziv,
              predmetId: predmet.id,
              realizacijaId: realizacija.id
            });
          }
        }
      });
      
      this.filteredPredmeti = Array.from(predmetRealizacijaMap.values())
        .sort((a, b) => a.predmetNaziv.localeCompare(b.predmetNaziv));
      
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
        let formValue = this.obavestenjeForm.getRawValue();
        
        let selectedNnr = this.nastavniciNaRealizaciji.find(nnr => 
          nnr.id === formValue.nastavnikNaRealizacijiId
        );
        
        if (!selectedNnr) {
          this.snackBar.open('Greška: Nije pronađen nastavnik na realizaciji', 'Zatvori', { duration: 3000 });
          return;
        }
        
        let obavestenjeData = {
          naslov: formValue.naslov,
          sadrzaj: formValue.sadrzaj,
          vremePostavljanja: new Date(),
          nastavnikNaRealizacijiId: formValue.nastavnikNaRealizacijiId,
          realizacijaPredmetaId: selectedNnr.realizacijaPredmetaId
        };

        let createdObavestenje = await firstValueFrom(this.obavestenjeService.create(obavestenjeData as Obavestenje));
        
        this.snackBar.open('Obaveštenje je uspešno kreirano!', 'Zatvori', { duration: 3000 });
        this.dialogRef.close(true);
        
      } catch (error) {
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
    let rawValue = this.obavestenjeForm.getRawValue();
    let isValid = !!(rawValue.nastavnikId && 
             rawValue.nastavnikNaRealizacijiId && 
             rawValue.naslov && 
             rawValue.sadrzaj);
    return isValid;
  }
}
