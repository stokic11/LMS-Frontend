import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Observable, forkJoin } from 'rxjs';
import { TerminNastaveService } from '../../services/terminNastave/termin-nastave.service';
import { IshodService } from '../../services/ishod/ishod.service';
import { TipNastaveService } from '../../services/tipNastave/tip-nastave.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { TerminNastave } from '../../models/terminNastave';
import { Ishod } from '../../models/ishod';
import { TipNastave } from '../../models/tipNastave';

interface TerminEdit extends TerminNastave {
  isEditing: boolean;
  isNew: boolean;
  originalData?: TerminNastave;
}

@Component({
  selector: 'app-termini-raspored',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  templateUrl: './termini-raspored.component.html',
  styleUrl: './termini-raspored.component.css'
})
export class TerminiRasporedComponent implements OnInit {
  termini: TerminEdit[] = [];
  dataSource = new MatTableDataSource<TerminEdit>([]);
  ishodi: Ishod[] = [];
  dostupniIshodi: Ishod[] = [];
  tipoviNastave: TipNastave[] = [];
  displayedColumns: string[] = ['vremePocetka', 'vremeZavrsetka', 'ishod', 'tipNastave', 'actions'];
  loading = false;
  isNastavnik = false;

  constructor(
    private terminNastaveService: TerminNastaveService,
    private ishodService: IshodService,
    private tipNastaveService: TipNastaveService,
    private authService: AuthenticationService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.checkNastavnikRole();
    this.loadData();
  }

  checkNastavnikRole(): void {
    const currentUser = this.authService.getCurrentUser();
    this.isNastavnik = currentUser?.uloge?.includes('nastavnik') || false;
  }

  loadData(): void {
    this.loading = true;
    forkJoin({
      termini: this.terminNastaveService.getAll(),
      ishodi: this.ishodService.getAll(),
      tipoviNastave: this.tipNastaveService.getAll()
    }).subscribe({
      next: (data) => {
        this.termini = data.termini.map(termin => ({ 
          ...termin, 
          isEditing: false, 
          isNew: false
        }));
        this.ishodi = Array.from(data.ishodi);
        this.tipoviNastave = Array.from(data.tipoviNastave);
        this.updateDostupniIshodi();
        this.dataSource.data = this.termini;
        this.loading = false;
      },
      error: (error) => {
        console.error('Greška pri učitavanju podataka:', error);
        this.snackBar.open('Greška pri učitavanju podataka. Molimo osvežite stranicu.', 'Zatvori', { duration: 5000 });
        this.loading = false;
      }
    });
  }

  addNewTermin(): void {
    if (this.dostupniIshodi.length === 0) {
      this.snackBar.open('Svi ishodi su već dodeljeni terminima nastave.', 'Zatvori', { duration: 3000 });
      return;
    }

    this.termini.forEach((t, index) => {
      if (t.isNew) {
        this.termini.splice(index, 1);
      } else if (t.isEditing) {
        this.cancelEdit(t, index);
      }
    });

    const now = new Date();
    const endTime = new Date(now.getTime() + 90 * 60000);
    
    const newTermin: TerminEdit = {
      vremePocetka: now.toISOString().slice(0, 19),
      vremeZavrsetka: endTime.toISOString().slice(0, 19),
      ishod: {} as Ishod,
      realizacijaPredmetaId: 1,
      tipNastave: {} as TipNastave,
      isEditing: true,
      isNew: true
    };
    
    this.termini.unshift(newTermin);
    this.dataSource.data = [...this.termini];
  }

  editTermin(termin: TerminEdit): void {
    this.termini.forEach((t, index) => {
      if (t !== termin) {
        if (t.isNew) {
          this.termini.splice(index, 1);
        } else if (t.isEditing) {
          this.cancelEdit(t, index);
        }
      }
    });
    
    this.dataSource.data = [...this.termini];
    
    termin.originalData = {
      id: termin.id,
      vremePocetka: termin.vremePocetka,
      vremeZavrsetka: termin.vremeZavrsetka,
      ishod: { ...termin.ishod },
      realizacijaPredmetaId: termin.realizacijaPredmetaId,
      tipNastave: { ...termin.tipNastave }
    };
    
    termin.isEditing = true;
  }

  saveTermin(termin: TerminEdit, index: number): void {
    if (!termin.ishod?.id || !termin.tipNastave?.id || !termin.vremePocetka || !termin.vremeZavrsetka) {
      this.snackBar.open('Molimo popunite sva polja!', 'Zatvori', { duration: 3000 });
      return;
    }

    if (termin.vremePocetka >= termin.vremeZavrsetka) {
      this.snackBar.open('Vreme početka mora biti pre vremena završetka!', 'Zatvori', { duration: 3000 });
      return;
    }

    this.loading = true;

    const terminDTO: TerminNastave = {
      id: termin.id,
      ishod: termin.ishod,
      vremePocetka: termin.vremePocetka,
      vremeZavrsetka: termin.vremeZavrsetka,
      tipNastave: termin.tipNastave,
      realizacijaPredmetaId: termin.realizacijaPredmetaId
    };

    let operation;
    if (termin.isNew) {
      operation = this.terminNastaveService.create(terminDTO);
    } else {
      operation = this.terminNastaveService.put(termin.id!, terminDTO);
    }

    operation.subscribe({
      next: (savedTermin) => {
        const updatedTermin = { 
          ...savedTermin, 
          isEditing: false, 
          isNew: false,
          originalData: undefined
        };
        this.termini[index] = updatedTermin;
        this.dataSource.data = [...this.termini];
        this.updateDostupniIshodi();
        this.loading = false;
        this.snackBar.open('Termin je uspešno sačuvan!', 'Zatvori', { duration: 3000 });
      },
      error: (error) => {
        console.error('Greška pri čuvanju termina:', error);
        this.snackBar.open('Greška pri čuvanju termina. Pokušajte ponovo.', 'Zatvori', { duration: 5000 });
        this.loading = false;
      }
    });
  }

  cancelEdit(termin: TerminEdit, index: number): void {
    if (termin.isNew) {
      this.termini.splice(index, 1);
      this.dataSource.data = [...this.termini];
      this.updateDostupniIshodi();
    } else {
      if (termin.originalData) {
        termin.vremePocetka = termin.originalData.vremePocetka;
        termin.vremeZavrsetka = termin.originalData.vremeZavrsetka;
        termin.ishod = { ...termin.originalData.ishod };
        termin.realizacijaPredmetaId = termin.originalData.realizacijaPredmetaId;
        termin.tipNastave = { ...termin.originalData.tipNastave };
      }
      termin.isEditing = false;
      termin.originalData = undefined;
    }
  }

  deleteTermin(termin: TerminEdit, index: number): void {
    if (termin.isNew) {
      this.termini.splice(index, 1);
      this.dataSource.data = [...this.termini];
      this.updateDostupniIshodi();
      return;
    }

    if (!confirm('Da li ste sigurni da želite da obrišete ovaj termin?')) {
      return;
    }

    this.loading = true;
    this.terminNastaveService.delete(termin.id!).subscribe({
      next: () => {
        this.termini.splice(index, 1);
        this.dataSource.data = [...this.termini];
        this.updateDostupniIshodi();
        this.loading = false;
        this.snackBar.open('Termin je uspešno obrisan!', 'Zatvori', { duration: 3000 });
      },
      error: (error) => {
        console.error('Greška pri brisanju termina:', error);
        this.snackBar.open('Greška pri brisanju termina. Pokušajte ponovo.', 'Zatvori', { duration: 5000 });
        this.loading = false;
      }
    });
  }

  getIshodNaziv(ishod: Ishod): string {
    return ishod?.opis || 'Nije izabran';
  }

  getTipNastaveNaziv(tipNastave: TipNastave): string {
    return tipNastave?.naziv || 'Nije izabran';
  }

  formatDateForInput(date: Date | string): string {
    if (!date) return '';
    if (typeof date === 'string') {
      return date.slice(0, 16);
    }
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  getDateFromString(dateTimeStr: string): Date | null {
    if (!dateTimeStr) return null;
    const dateOnly = dateTimeStr.split('T')[0];
    return new Date(dateOnly + 'T00:00:00');
  }

  getTimeFromString(dateTimeStr: string): string {
    if (!dateTimeStr) return '';
    const timePart = dateTimeStr.split('T')[1];
    return timePart ? timePart.slice(0, 5) : '';
  }

  updateDatumPocetka(termin: TerminEdit, newDate: Date): void {
    if (!newDate) return;
    const currentTime = this.getTimeFromString(termin.vremePocetka) || '08:00';
    const dateStr = newDate.toISOString().split('T')[0];
    termin.vremePocetka = `${dateStr}T${currentTime}:00`;
  }

  updateDatumZavrsetka(termin: TerminEdit, newDate: Date): void {
    if (!newDate) return;
    const currentTime = this.getTimeFromString(termin.vremeZavrsetka) || '10:00';
    const dateStr = newDate.toISOString().split('T')[0];
    termin.vremeZavrsetka = `${dateStr}T${currentTime}:00`;
  }

  updateVremePocetka(termin: TerminEdit, timeValue: string): void {
    if (!timeValue) return;
    const currentDate = this.getDateFromString(termin.vremePocetka);
    const dateStr = currentDate ? currentDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    termin.vremePocetka = `${dateStr}T${timeValue}:00`;
  }

  updateVremeZavrsetka(termin: TerminEdit, timeValue: string): void {
    if (!timeValue) return;
    const currentDate = this.getDateFromString(termin.vremeZavrsetka);
    const dateStr = currentDate ? currentDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    termin.vremeZavrsetka = `${dateStr}T${timeValue}:00`;
  }

  compareIshod(a: Ishod, b: Ishod): boolean {
    return a && b ? a.id === b.id : a === b;
  }

  compareTipNastave(a: TipNastave, b: TipNastave): boolean {
    return a && b ? a.id === b.id : a === b;
  }

  updateDostupniIshodi(): void {
    const zauzeti = this.termini
      .filter(t => !t.isNew && t.ishod?.id)
      .map(t => t.ishod.id);
    
    this.dostupniIshodi = this.ishodi.filter(ishod => !zauzeti.includes(ishod.id));
  }

  getDostupniIshodiForTermin(currentTermin: TerminEdit): Ishod[] {
    const zauzeti = this.termini
      .filter(t => !t.isNew && t.ishod?.id && t.id !== currentTermin.id)
      .map(t => t.ishod.id);
    
    let dostupni = this.ishodi.filter(ishod => !zauzeti.includes(ishod.id));
    
    if (currentTermin.ishod?.id && !dostupni.find(i => i.id === currentTermin.ishod.id)) {
      dostupni.push(currentTermin.ishod);
    }
    
    return dostupni;
  }

  isValidTimeRange(termin: TerminEdit): boolean {
    if (!termin.vremePocetka || !termin.vremeZavrsetka) return false;
    return termin.vremePocetka < termin.vremeZavrsetka;
  }
}
