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
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { NastavnikService } from '../../services/nastavnik/nastavnik.service';
import { NastavnikNaRealizacijiService } from '../../services/nastavnikNaRealizaciji/nastavnik-na-realizaciji.service';
import { PredmetService } from '../../services/predmet/predmet.service';
import { RealizacijaPredmetaService } from '../../services/realizacijaPredmeta/realizacija-predmeta.service';
import { TipNastaveService } from '../../services/tipNastave/tip-nastave.service';
import { Nastavnik } from '../../models/nastavnik';
import { NastavnikNaRealizaciji } from '../../models/nastavnikNaRealizaciji';
import { Predmet } from '../../models/predmet';
import { RealizacijaPredmeta } from '../../models/realizacijaPredmeta';
import { TipNastave } from '../../models/tipNastave';
import { GenericTableComponent, TableColumn, TableAction } from '../generic-table/generic-table.component';

@Component({
  selector: 'app-organizacija-nastave',
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
    FormsModule,
    GenericTableComponent
  ],
  templateUrl: './organizacija-nastave.component.html',
  styleUrls: ['./organizacija-nastave.component.css']
})
export class OrganizacijaNastaveComponent implements OnInit {
  
  nastavnici: Nastavnik[] = [];
  tipoviNastave: TipNastave[] = [];
  predmeti: Predmet[] = [];
  selectedNastavnik: Nastavnik | null = null;
  selectedTipNastave: TipNastave | null = null;
  selectedPredmet: Predmet | null = null;
  brojCasova = 0;
  loading = false;
  
  tableColumns: TableColumn[] = [
    { key: 'ime', label: 'Ime' },
    { key: 'prezime', label: 'Prezime' },
    { key: 'email', label: 'Email' },
    { key: 'biografija', label: 'Biografija' }
  ];

  tableActions: TableAction[] = [
    {
      label: 'Izaberi',
      color: 'primary',
      action: (nastavnik: Nastavnik) => this.selectNastavnik(nastavnik)
    }
  ];
  
  constructor(
    private nastavnikService: NastavnikService,
    private nastavnikNaRealizacijiService: NastavnikNaRealizacijiService,
    private predmetService: PredmetService,
    private realizacijaPredmetaService: RealizacijaPredmetaService,
    private tipNastaveService: TipNastaveService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadNastavnici();
    this.loadTipoviNastave();
    this.loadPredmeti();
  }

  async loadNastavnici(): Promise<void> {
    this.loading = true;
    try {
      let response = await firstValueFrom(
        this.nastavnikService.getAll()
      );
      this.nastavnici = response;
    } catch (error) {
      console.error('Greška pri učitavanju nastavnika:', error);
      this.snackBar.open('Greška pri učitavanju nastavnika', 'Zatvori', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }

  async loadTipoviNastave(): Promise<void> {
    try {
      let response = await firstValueFrom(
        this.tipNastaveService.getAll()
      );
      this.tipoviNastave = response;
    } catch (error) {
      console.error('Greška pri učitavanju tipova nastave:', error);
      this.snackBar.open('Greška pri učitavanju tipova nastave', 'Zatvori', { duration: 3000 });
    }
  }

  async loadPredmeti(): Promise<void> {
    try {
      let response = await firstValueFrom(
        this.predmetService.getAll()
      );
      this.predmeti = response;
    } catch (error) {
      console.error('Greška pri učitavanju predmeta:', error);
      this.snackBar.open('Greška pri učitavanju predmeta', 'Zatvori', { duration: 3000 });
    }
  }

  selectNastavnik(nastavnik: Nastavnik): void {
    this.selectedNastavnik = nastavnik;
  }

  async dodajNastavnikaNaRealizaciju(): Promise<void> {
    if (!this.selectedNastavnik || !this.selectedTipNastave || !this.selectedPredmet || this.brojCasova <= 0) {
      this.snackBar.open('Molimo popunite sva polja', 'Zatvori', { duration: 3000 });
      return;
    }

    this.loading = true;
    try {
      const novaRealizacijaPredmeta: RealizacijaPredmeta = {
        predmetId: this.selectedPredmet.id!
      };

      console.log('Kreiram realizaciju predmeta:', novaRealizacijaPredmeta);
      let kreirana_realizacija = await firstValueFrom(
        this.realizacijaPredmetaService.create(novaRealizacijaPredmeta)
      );

      let nastavnikNaRealizaciji: NastavnikNaRealizaciji = {
        brojCasova: this.brojCasova,
        realizacijaPredmetaId: kreirana_realizacija.id!,
        tipNastave: this.selectedTipNastave,
        nastavnikId: this.selectedNastavnik.id!
      };

      console.log('Kreiram nastavnika na realizaciji:', nastavnikNaRealizaciji);
      let response = await firstValueFrom(
        this.nastavnikNaRealizacijiService.create(nastavnikNaRealizaciji)
      );
      
      this.snackBar.open(`Nastavnik ${this.selectedNastavnik.ime} ${this.selectedNastavnik.prezime} je uspešno dodeljen na predmet ${this.selectedPredmet.naziv}!`, 'Zatvori', { duration: 5000 });
      
      this.selectedTipNastave = null;
      this.selectedPredmet = null;
      this.brojCasova = 0;
      
    } catch (error) {
      console.error('Greška pri dodeli nastavnika na realizaciju:', error);
      this.snackBar.open('Greška pri dodeli nastavnika na realizaciju', 'Zatvori', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }

  resetSelection(): void {
    this.selectedNastavnik = null;
    this.selectedTipNastave = null;
    this.selectedPredmet = null;
    this.brojCasova = 0;
  }
}
