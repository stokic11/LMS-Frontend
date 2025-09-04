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
import { GenericDialogComponent } from '../generic-dialog/generic-dialog.component';
import { DialogConfig, FieldConfig } from '../generic-dialog/field-config.interface';

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
          ...ispit
        }));
      }
    } catch (error) {
      this.snackBar.open('Greška pri učitavanju prijavljenih ispita', 'Zatvori', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }

  oceniStudenta(ispit: any): void {
    const dialogConfig: DialogConfig = {
      title: `Ocenjivanje`,
      subtitle: `${ispit.studentIme} ${ispit.studentPrezime} - ${ispit.studentBrojIndeksa}`,
      isNew: false,
      data: {
        bodovi: ispit.bodovi === '-' ? 0 : ispit.bodovi,
        napomena: ''
      },
      fields: [
        {
          name: 'bodovi',
          label: 'Bodovi (0-100)',
          type: 'number',
          required: true,
          min: 0,
          max: 100
        },
        {
          name: 'ocenaPreview',
          label: '',
          type: 'dynamic-text',
          dynamicText: (formValue: any) => {
            const bodovi = formValue.bodovi;
            if (!bodovi || bodovi < 0 || bodovi > 100) {
              return 'Ocena:';
            }
            if (bodovi < 51) {
              return 'Ocena: 5';
            } else if (bodovi <= 60) {
              return 'Ocena: 6';
            } else if (bodovi <= 70) {
              return 'Ocena: 7';
            } else if (bodovi <= 80) {
              return 'Ocena: 8';
            } else if (bodovi <= 90) {
              return 'Ocena: 9';
            } else {
              return 'Ocena: 10';
            }
          }
        },
        {
          name: 'napomena',
          label: 'Napomena (opciono)',
          type: 'textarea',
          required: false,
          maxLength: 500,
          rows: 3
        }
      ]
    };

    const dialogRef = this.dialog.open(GenericDialogComponent, {
      width: '500px',
      data: dialogConfig
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sacuvajOcenu(ispit.id, result.bodovi, result.napomena || '');
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
          ...ispit
        }));
      }
    } catch (error) {
      this.snackBar.open('Greška pri učitavanju ocenjenih ispita', 'Zatvori', { duration: 3000 });
    }
  }
}
