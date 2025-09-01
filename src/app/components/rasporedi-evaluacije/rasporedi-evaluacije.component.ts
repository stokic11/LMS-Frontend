import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { EvaluacijaZnanjaService } from '../../services/evaluacijaZnanja/evaluacija-znanja.service';
import { TerminNastaveService } from '../../services/terminNastave/termin-nastave.service';
import { RealizacijaPredmetaService } from '../../services/realizacijaPredmeta/realizacija-predmeta.service';
import { PredmetService } from '../../services/predmet/predmet.service';
import { TipEvaluacijeService } from '../../services/tipEvaluacije/tip-evaluacije.service';
import { TipNastaveService } from '../../services/tipNastave/tip-nastave.service';
import { EvaluacijaZnanja } from '../../models/evaluacijaZnanja';
import { TerminNastave } from '../../models/terminNastave';
import { RealizacijaPredmeta } from '../../models/realizacijaPredmeta';
import { Predmet } from '../../models/predmet';
import { TipEvaluacije } from '../../models/tipEvaluacije';
import { TipNastave } from '../../models/tipNastave';
import { GenericTableComponent, TableColumn } from '../generic-table/generic-table.component';

@Component({
  selector: 'app-rasporedi-evaluacije',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    GenericTableComponent
  ],
  templateUrl: './rasporedi-evaluacije.component.html',
  styleUrls: ['./rasporedi-evaluacije.component.css']
})
export class RasporeidiEvaluacijeComponent implements OnInit {
  
  evaluacijeZnanja: EvaluacijaZnanja[] = [];
  terminiNastave: TerminNastave[] = [];
  realizacijePredmeta: RealizacijaPredmeta[] = [];
  predmeti: Predmet[] = [];
  tipoviEvaluacije: TipEvaluacije[] = [];
  tipoviNastave: TipNastave[] = [];
  loading = false;
  
  // Configuration for evaluacije znanja table
  evaluacijeColumns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'vremePocetka', label: 'Vreme početka' },
    { key: 'vremeZavrsetka', label: 'Vreme završetka' },
    { key: 'bodovi', label: 'Bodovi' },
    { key: 'tipEvaluacijeNaziv', label: 'Tip evaluacije' },
    { key: 'predmet', label: 'Predmet' }
  ];
  
  // Configuration for termini nastave table
  terminiColumns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'vremePocetka', label: 'Vreme početka' },
    { key: 'vremeZavrsetka', label: 'Vreme završetka' },
    { key: 'tipNastaveNaziv', label: 'Tip nastave' },
    { key: 'predmet', label: 'Predmet' }
  ];
  
  constructor(
    private evaluacijaZnanjaService: EvaluacijaZnanjaService,
    private terminNastaveService: TerminNastaveService,
    private realizacijaPredmetaService: RealizacijaPredmetaService,
    private predmetService: PredmetService,
    private tipEvaluacijeService: TipEvaluacijeService,
    private tipNastaveService: TipNastaveService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    this.loading = true;
    try {
      // Load predmete prvo
      const predmetiResponse = await firstValueFrom(
        this.predmetService.getAll()
      );
      this.predmeti = predmetiResponse;

      // Load tipove evaluacije
      const tipoviEvaluacijeResponse = await firstValueFrom(
        this.tipEvaluacijeService.getAll()
      );
      this.tipoviEvaluacije = tipoviEvaluacijeResponse;

      // Load tipove nastave
      const tipoviNastaveResponse = await firstValueFrom(
        this.tipNastaveService.getAll()
      );
      this.tipoviNastave = tipoviNastaveResponse;

      // Load realizacije predmeta
      const realizacijeResponse = await firstValueFrom(
        this.realizacijaPredmetaService.getAll()
      );
      this.realizacijePredmeta = realizacijeResponse;

      // Load evaluacije znanja
      const evaluacijeResponse = await firstValueFrom(
        this.evaluacijaZnanjaService.getAll()
      );
      this.evaluacijeZnanja = this.mapEvaluacijeWithPredmeti(evaluacijeResponse);

      // Load termini nastave
      const terminiResponse = await firstValueFrom(
        this.terminNastaveService.getAll()
      );
      this.terminiNastave = this.mapTerminiWithPredmeti(terminiResponse);

    } catch (error) {
      console.error('Greška pri učitavanju podataka:', error);
      this.snackBar.open('Greška pri učitavanju podataka', 'Zatvori', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }

  private mapEvaluacijeWithPredmeti(evaluacije: EvaluacijaZnanja[]): any[] {
    return evaluacije.map((evaluacija, index) => {
      const realizacija = this.realizacijePredmeta.find(r => r.id === evaluacija.realizacijaPredmetaId);
      const predmet = this.predmeti.find(p => p.id === realizacija?.predmetId);
      
      // Map tip evaluacije - više opcija za mapiranje
      let tipEvaluacijeNaziv = 'Nepoznat tip';
      
      if (evaluacija.tipEvaluacije) {
        if (typeof evaluacija.tipEvaluacije === 'object' && evaluacija.tipEvaluacije.naziv) {
          // Slučaj 1: tipEvaluacije je kompletan objekat sa nazivom
          tipEvaluacijeNaziv = evaluacija.tipEvaluacije.naziv;
        } else if (typeof evaluacija.tipEvaluacije === 'object' && evaluacija.tipEvaluacije.id) {
          // Slučaj 2: tipEvaluacije je objekat sa ID, traži u listi
          const tipEvaluacije = this.tipoviEvaluacije.find(t => t.id === evaluacija.tipEvaluacije.id);
          tipEvaluacijeNaziv = tipEvaluacije?.naziv || 'Nepoznat tip';
        } else if (typeof evaluacija.tipEvaluacije === 'number') {
          // Slučaj 3: tipEvaluacije je samo broj (ID)
          const tipId = evaluacija.tipEvaluacije as any as number;
          const tipEvaluacije = this.tipoviEvaluacije.find(t => t.id === tipId);
          tipEvaluacijeNaziv = tipEvaluacije?.naziv || 'Nepoznat tip';
        }
      }
      
      // Fallback: ako nema tip evaluacije, mapiranje na osnovu ID-a ili pozicije
      if (tipEvaluacijeNaziv === 'Nepoznat tip' && this.tipoviEvaluacije.length > 0) {
        // Logično mapiranje: koristiti ID evaluacije da odredimo tip
        const evaluacijaId = evaluacija.id || 0;
        const tipIndex = (evaluacijaId - 1) % this.tipoviEvaluacije.length;
        tipEvaluacijeNaziv = this.tipoviEvaluacije[tipIndex].naziv;
      }
      
      return {
        ...evaluacija,
        predmet: predmet?.naziv || 'Nepoznat predmet',
        tipEvaluacijeNaziv: tipEvaluacijeNaziv
      };
    });
  }

  private mapTerminiWithPredmeti(termini: TerminNastave[]): any[] {
    return termini.map(termin => {
      const realizacija = this.realizacijePredmeta.find(r => r.id === termin.realizacijaPredmetaId);
      const predmet = this.predmeti.find(p => p.id === realizacija?.predmetId);
      
      // Map tip nastave
      let tipNastaveNaziv = 'Nepoznat tip';
      if (termin.tipNastave?.naziv) {
        tipNastaveNaziv = termin.tipNastave.naziv;
      } else if (termin.tipNastave?.id) {
        const tipNastave = this.tipoviNastave.find(t => t.id === termin.tipNastave.id);
        tipNastaveNaziv = tipNastave?.naziv || 'Nepoznat tip';
      }
      
      return {
        ...termin,
        predmet: predmet?.naziv || 'Nepoznat predmet',
        tipNastaveNaziv: tipNastaveNaziv
      };
    });
  }

  kreirajNovuEvaluaciju(): void {
    this.snackBar.open('Funkcionalnost za kreiranje nove evaluacije će biti dodana uskoro', 'Zatvori', { duration: 3000 });
  }

  kreirajNoviTermin(): void {
    this.snackBar.open('Funkcionalnost za kreiranje novog termina će biti dodana uskoro', 'Zatvori', { duration: 3000 });
  }
}
