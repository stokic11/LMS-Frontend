import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { PolaganjeService } from '../../services/polaganje/polaganje.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { GenericTableComponent, TableColumn, TableAction } from '../generic-table/generic-table.component';
import { NastavnikOcenjivanjeDialogComponent } from '../nastavnik-ocenjivanje-dialog/nastavnik-ocenjivanje-dialog.component';

@Component({
  selector: 'app-nastavnik-ocenjivanje',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatCardModule,
    MatDialogModule,
    FormsModule,
    GenericTableComponent
  ],
  templateUrl: './nastavnik-ocenjivanje.component.html',
  styleUrls: ['./nastavnik-ocenjivanje.component.css']
})
export class NastavnikOcenjivanjeComponent implements OnInit {
  
  prijavljeniIspiti: any[] = [];
  ocenjeniIspiti: any[] = [];
  loading = false;
  
  tableColumns: TableColumn[] = [
    { key: 'studentIme', label: 'Ime' },
    { key: 'studentPrezime', label: 'Prezime' },
    { key: 'studentBrojIndeksa', label: 'Broj indeksa' },
    { key: 'predmetNaziv', label: 'Predmet' },
    { key: 'tipEvaluacije', label: 'Tip evaluacije' },
    { key: 'vremePocetka', label: 'Datum ispita' }
  ];

  tableActions: TableAction[] = [
    {
      label: 'Oceni',
      color: 'primary',
      action: (ispit: any) => this.oceniStudenta(ispit)
    }
  ];

  ocenjeniTableColumns: TableColumn[] = [
    { key: 'studentIme', label: 'Ime' },
    { key: 'studentPrezime', label: 'Prezime' },
    { key: 'studentBrojIndeksa', label: 'Broj indeksa' },
    { key: 'predmetNaziv', label: 'Predmet' },
    { key: 'tipEvaluacije', label: 'Tip evaluacije' },
    { key: 'vremePocetka', label: 'Datum ispita' },
    { key: 'bodovi', label: 'Bodovi' },
    { key: 'ocena', label: 'Ocena' },
    { key: 'status', label: 'Status' },
    { key: 'napomena', label: 'Napomena' }
  ];

  trackByIspitId(index: number, ispit: any): any {
    return ispit.id;
  }
  
  constructor(
    private polaganjeService: PolaganjeService,
    private authService: AuthenticationService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadPrijavljeneIspite();
    this.loadOcenjeneIspite();
  }

  async loadPrijavljeneIspite(): Promise<void> {
    this.loading = true;
    try {
      const nastavnikId = this.authService.getKorisnikId();
      if (nastavnikId) {
        const response = await firstValueFrom(
          this.polaganjeService.getPrijavljeneIspiteZaNastavnika(nastavnikId)
        );
        this.prijavljeniIspiti = response.map(ispit => ({
          ...ispit,
          vremePocetka: new Date(ispit.vremePocetka).toLocaleDateString('sr-RS')
        }));
      }
    } catch (error) {
      this.snackBar.open('Greška pri učitavanju prijavljenih ispita', 'Zatvori', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }

  oceniStudenta(ispit: any): void {
    const dialogRef = this.dialog.open(NastavnikOcenjivanjeDialogComponent, {
      width: '500px',
      data: {
        student: `${ispit.studentIme} ${ispit.studentPrezime}`,
        brojIndeksa: ispit.studentBrojIndeksa,
        predmet: ispit.predmetNaziv,
        tipEvaluacije: ispit.tipEvaluacije,
        trenutniBodovi: ispit.bodovi === '-' ? 0 : ispit.bodovi,
        trenutnaNapomena: ispit.napomena || ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sacuvajOcenu(ispit.id, result.bodovi, result.napomena);
      }
    });
  }

  async sacuvajOcenu(polaganjeId: number, bodovi: number, napomena: string): Promise<void> {
    this.loading = true;
    try {
      await firstValueFrom(
        this.polaganjeService.oceniStudenta(polaganjeId, bodovi, napomena)
      );
      
      this.snackBar.open('Student je uspešno ocenjen!', 'Zatvori', { duration: 3000 });
      await this.loadPrijavljeneIspite();
      await this.loadOcenjeneIspite();
      
    } catch (error) {
      this.snackBar.open('Greška pri ocenjivanju studenta', 'Zatvori', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }

  async loadOcenjeneIspite(): Promise<void> {
    try {
      const nastavnikId = this.authService.getKorisnikId();
      if (nastavnikId) {
        const response = await firstValueFrom(
          this.polaganjeService.getOcenjeneIspiteZaNastavnika(nastavnikId)
        );
        this.ocenjeniIspiti = response.map(ispit => ({
          ...ispit,
          vremePocetka: new Date(ispit.vremePocetka).toLocaleDateString('sr-RS')
        }));
      }
    } catch (error) {
      this.snackBar.open('Greška pri učitavanju ocenjenih ispita', 'Zatvori', { duration: 3000 });
    }
  }
}
