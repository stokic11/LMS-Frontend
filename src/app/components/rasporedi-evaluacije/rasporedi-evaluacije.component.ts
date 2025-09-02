import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { EvaluacijaZnanjaService } from '../../services/evaluacijaZnanja/evaluacija-znanja.service';
import { TerminNastaveService } from '../../services/terminNastave/termin-nastave.service';
import { RealizacijaPredmetaService } from '../../services/realizacijaPredmeta/realizacija-predmeta.service';
import { PredmetService } from '../../services/predmet/predmet.service';
import { TipEvaluacijeService } from '../../services/tipEvaluacije/tip-evaluacije.service';
import { TipNastaveService } from '../../services/tipNastave/tip-nastave.service';
import { IshodService } from '../../services/ishod/ishod.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { EvaluacijaZnanja } from '../../models/evaluacijaZnanja';
import { TerminNastave } from '../../models/terminNastave';
import { RealizacijaPredmeta } from '../../models/realizacijaPredmeta';
import { Predmet } from '../../models/predmet';
import { TipEvaluacije } from '../../models/tipEvaluacije';
import { TipNastave } from '../../models/tipNastave';
import { Ishod } from '../../models/ishod';
import { GenericTableComponent, TableColumn } from '../generic-table/generic-table.component';
import { GenericDialogComponent } from '../generic-dialog/generic-dialog.component';

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
  ishodi: Ishod[] = [];
  loading = false;
  canCreateNew = false; 
  
  
  evaluacijeColumns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'vremePocetka', label: 'Vreme početka' },
    { key: 'vremeZavrsetka', label: 'Vreme završetka' },
    { key: 'bodovi', label: 'Bodovi' },
    { key: 'tipEvaluacijeNaziv', label: 'Tip evaluacije' },
    { key: 'predmet', label: 'Predmet' }
  ];
  
  
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
    private ishodService: IshodService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    this.loading = true;
    try {
      console.log('Pocinje ucitavanje podataka...');
      
      
      this.predmeti = [];
      this.tipoviEvaluacije = [];
      this.tipoviNastave = [];
      this.realizacijePredmeta = [];
      this.evaluacijeZnanja = [];
      this.terminiNastave = [];
      this.ishodi = [];

      
      try {
        const tipoviEvaluacijeResponse = await firstValueFrom(
          this.tipEvaluacijeService.getAll()
        );
        this.tipoviEvaluacije = tipoviEvaluacijeResponse;
        console.log('Ucitano tipova evaluacije:', this.tipoviEvaluacije.length);
      } catch (error: any) {
        if (error?.status === 403) {
          console.log('Tipovi evaluacije nisu dostupni studentskoj službi (403 Forbidden)');
        } else {
          console.log('Tipovi evaluacije nisu dostupni studentskoj službi:', error?.message || 'Unknown error');
        }
      }

      
      try {
        const tipoviNastaveResponse = await firstValueFrom(
          this.tipNastaveService.getAll()
        );
        this.tipoviNastave = tipoviNastaveResponse;
        console.log('Ucitano tipova nastave:', this.tipoviNastave.length);
      } catch (error: any) {
        if (error?.status === 403) {
          console.log('Tipovi nastave nisu dostupni studentskoj službi (403 Forbidden)');
        } else {
          console.log('Tipovi nastave nisu dostupni studentskoj službi:', error?.message || 'Unknown error');
        }
      }

      
      try {
        const predmetiResponse = await firstValueFrom(
          this.predmetService.getAll()
        );
        this.predmeti = predmetiResponse;
        console.log('Ucitano predmeta:', this.predmeti.length);
      } catch (error) {
        console.log('Predmeti nisu dostupni studentskoj službi:', error);
      }

      
      try {
        const realizacijeResponse = await firstValueFrom(
          this.realizacijaPredmetaService.getAll()
        );
        this.realizacijePredmeta = realizacijeResponse;
        console.log('Ucitano realizacija predmeta:', this.realizacijePredmeta.length);
      } catch (error) {
        console.log('Realizacije predmeta nisu dostupne studentskoj službi:', error);
      }

      
      try {
        const ishodiResponse = await firstValueFrom(
          this.ishodService.getAll()
        );
        this.ishodi = ishodiResponse;
        console.log('Ucitano ishoda:', this.ishodi.length);
      } catch (error) {
        console.log('Ishodi nisu dostupni studentskoj službi:', error);
      }

      
      try {
        let evaluacijeResponse: EvaluacijaZnanja[] = [];
        
        if (this.authService.hasRole('studentska_sluzba')) {
          
          try {
            evaluacijeResponse = await firstValueFrom(
              this.evaluacijaZnanjaService.getAllForStudentskaSluzba()
            );
            console.log('Ucitano evaluacija znanja za studentsku službu:', evaluacijeResponse.length);
          } catch (specificError: any) {
            console.log('Specifični endpoint za studentsku službu nije dostupan, pokušavam alternativni...');
            
            try {
              evaluacijeResponse = await firstValueFrom(
                this.evaluacijaZnanjaService.getAllEvaluacije()
              );
              console.log('Ucitano evaluacija znanja kroz alternativni endpoint:', evaluacijeResponse.length);
            } catch (altError: any) {
              console.log('Alternativni endpoint nije dostupan, koristim getAll...');
              evaluacijeResponse = await firstValueFrom(
                this.evaluacijaZnanjaService.getAll()
              );
              console.log('Ucitano evaluacija znanja kroz getAll:', evaluacijeResponse.length);
            }
          }
        } else {
          
          evaluacijeResponse = await firstValueFrom(
            this.evaluacijaZnanjaService.getAll()
          );
          console.log('Ucitano evaluacija znanja (standardno):', evaluacijeResponse.length);
        }
        
        this.evaluacijeZnanja = this.mapEvaluacijeWithPredmeti(evaluacijeResponse);
        console.log('Evaluacije znanja nakon mapiranja:', this.evaluacijeZnanja.length);
      } catch (error: any) {
        
        if (error?.status === 403) {
          console.log('Evaluacije znanja nisu dostupne studentskoj službi (403 Forbidden)');
        } else {
          console.log('Evaluacije znanja nisu dostupne studentskoj službi:', error?.message || 'Unknown error');
        }
        this.evaluacijeZnanja = [];
      }

      
      try {
        const terminiResponse = await firstValueFrom(
          this.terminNastaveService.getAll()
        );
        console.log('Ucitano termina nastave (raw):', terminiResponse.length);
        this.terminiNastave = this.mapTerminiWithPredmeti(terminiResponse);
        console.log('Termini nastave nakon mapiranja:', this.terminiNastave.length);
      } catch (error: any) {
        
        if (error?.status === 403) {
          console.log('Termini nastave nisu dostupni studentskoj službi (403 Forbidden)');
        } else {
          console.log('Termini nastave nisu dostupni studentskoj službi:', error?.message || 'Unknown error');
        }
        this.terminiNastave = [];
      }

     
      this.canCreateNew = this.realizacijePredmeta.length > 0 && 
                         (this.tipoviEvaluacije.length > 0 || this.tipoviNastave.length > 0);

      
      if (this.evaluacijeZnanja.length === 0 && this.terminiNastave.length > 0) {
        this.snackBar.open(`Učitano ${this.terminiNastave.length} termina nastave. Evaluacije znanja će biti dostupne uskoro.`, 'Zatvori', { duration: 4000 });
      } else if (this.evaluacijeZnanja.length > 0 && this.terminiNastave.length === 0) {
        this.snackBar.open(`Učitano ${this.evaluacijeZnanja.length} evaluacija znanja. Termini nastave će biti dostupni uskoro.`, 'Zatvori', { duration: 4000 });
      } else if (this.evaluacijeZnanja.length > 0 && this.terminiNastave.length > 0) {
        this.snackBar.open(`Uspešno učitano ${this.evaluacijeZnanja.length} evaluacija i ${this.terminiNastave.length} termina nastave.`, 'Zatvori', { duration: 3000 });
      } else {
        this.snackBar.open('Podaci će biti dostupni uskoro. Ako je problem dugotrajan, kontaktirajte administratora.', 'Zatvori', { duration: 5000 });
      }

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
      
      
      let tipEvaluacijeNaziv = 'Nepoznat tip';
      
      if (evaluacija.tipEvaluacije) {
        if (typeof evaluacija.tipEvaluacije === 'object' && evaluacija.tipEvaluacije.naziv) {
          
          tipEvaluacijeNaziv = evaluacija.tipEvaluacije.naziv;
        } else if (typeof evaluacija.tipEvaluacije === 'object' && evaluacija.tipEvaluacije.id) {
          
          const tipEvaluacije = this.tipoviEvaluacije.find(t => t.id === evaluacija.tipEvaluacije.id);
          tipEvaluacijeNaziv = tipEvaluacije?.naziv || 'Nepoznat tip';
        } else if (typeof evaluacija.tipEvaluacije === 'number') {
         
          const tipId = evaluacija.tipEvaluacije as any as number;
          const tipEvaluacije = this.tipoviEvaluacije.find(t => t.id === tipId);
          tipEvaluacijeNaziv = tipEvaluacije?.naziv || 'Nepoznat tip';
        }
      }
      
      
      if (tipEvaluacijeNaziv === 'Nepoznat tip' && this.tipoviEvaluacije.length > 0) {
        
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
    if (!this.canCreateNew) {
      this.snackBar.open('Nemate dozvole za kreiranje novih evaluacija. Kontaktirajte administratora.', 'Zatvori', { duration: 3000 });
      return;
    }

    const realizacijeOptions = this.realizacijePredmeta.map(rp => {
      const predmet = this.predmeti.find(p => p.id === rp.predmetId);
      return {
        value: rp.id,
        label: `${predmet?.naziv || 'Nepoznat predmet'} (Realizacija ${rp.id})`
      };
    });

    const tipoviEvaluacijeOptions = this.tipoviEvaluacije.map(tip => ({
      value: tip.id,
      label: tip.naziv
    }));

    const ishodiOptions = this.ishodi.map(ishod => ({
      value: ishod.id,
      label: ishod.opis
    }));

    if (realizacijeOptions.length === 0) {
      this.snackBar.open('Nema dostupnih realizacija predmeta za kreiranje evaluacije', 'Zatvori', { duration: 3000 });
      return;
    }

    if (tipoviEvaluacijeOptions.length === 0) {
      this.snackBar.open('Nema dostupnih tipova evaluacije za kreiranje evaluacije', 'Zatvori', { duration: 3000 });
      return;
    }

    const dialogRef = this.dialog.open(GenericDialogComponent, {
      width: '600px',
      data: {
        title: 'Dodaj evaluaciju znanja',
        fields: [
          { 
            name: 'bodovi', 
            label: 'Bodovi', 
            type: 'number', 
            required: true,
            min: 0,
            max: 100
          },
          { 
            name: 'vremePocetka', 
            label: 'Vreme početka', 
            type: 'datetime', 
            required: true
          },
          { 
            name: 'vremeZavrsetka', 
            label: 'Vreme završetka', 
            type: 'datetime', 
            required: true
          },
          { 
            name: 'realizacijaPredmetaId', 
            label: 'Predmet', 
            type: 'select', 
            required: true,
            options: realizacijeOptions
          },
          { 
            name: 'tipEvaluacije', 
            label: 'Tip evaluacije', 
            type: 'select', 
            required: true,
            options: tipoviEvaluacijeOptions
          },
          { 
            name: 'ishod', 
            label: 'Ishod', 
            type: 'select', 
            required: false,
            options: ishodiOptions
          }
        ]
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.realizacijaPredmetaId) {
          result.realizacijaPredmetaId = Number(result.realizacijaPredmetaId);
        }
        if (result.tipEvaluacije) {
          const tipEvaluacije = this.tipoviEvaluacije.find(tip => tip.id === Number(result.tipEvaluacije));
          result.tipEvaluacije = tipEvaluacije;
        }
        if (result.ishod) {
          const ishod = this.ishodi.find(i => i.id === Number(result.ishod));
          result.ishod = ishod;
        }
        
        this.evaluacijaZnanjaService.create(result).subscribe({
          next: (response) => {
            this.snackBar.open('Evaluacija znanja je uspešno kreirana', 'Zatvori', { duration: 3000 });
            this.loadData();
          },
          error: (error: any) => {
            console.error('Error creating evaluacija znanja:', error);
            
            if (error?.status === 403 && this.authService.hasRole('studentska_sluzba')) {
              this.evaluacijaZnanjaService.createForStudentskaSluzba(result).subscribe({
                next: (response) => {
                  this.snackBar.open('Evaluacija znanja je uspešno kreirana', 'Zatvori', { duration: 3000 });
                  this.loadData();
                },
                error: (altError: any) => {
                  console.error('Error creating evaluacija znanja through alternative endpoint:', altError);
                  this.snackBar.open('Greška pri kreiranju evaluacije znanja. Kontaktirajte administratora.', 'Zatvori', { duration: 3000 });
                }
              });
            } else {
              this.snackBar.open('Greška pri kreiranju evaluacije znanja', 'Zatvori', { duration: 3000 });
            }
          }
        });
      }
    });
  }

  kreirajNoviTermin(): void {
    if (!this.canCreateNew) {
      this.snackBar.open('Nemate dozvole za kreiranje novih termina. Kontaktirajte administratora.', 'Zatvori', { duration: 3000 });
      return;
    }

    const realizacijeOptions = this.realizacijePredmeta.map(rp => {
      const predmet = this.predmeti.find(p => p.id === rp.predmetId);
      return {
        value: rp.id,
        label: `${predmet?.naziv || 'Nepoznat predmet'} (Realizacija ${rp.id})`
      };
    });

    const tipoviNastaveOptions = this.tipoviNastave.map(tip => ({
      value: tip.id,
      label: tip.naziv
    }));

    const ishodiOptionsTermin = this.ishodi.map(ishod => ({
      value: ishod.id,
      label: ishod.opis
    }));

    if (realizacijeOptions.length === 0) {
      this.snackBar.open('Nema dostupnih realizacija predmeta za kreiranje termina', 'Zatvori', { duration: 3000 });
      return;
    }

    if (tipoviNastaveOptions.length === 0) {
      this.snackBar.open('Nema dostupnih tipova nastave za kreiranje termina', 'Zatvori', { duration: 3000 });
      return;
    }

    const dialogRef = this.dialog.open(GenericDialogComponent, {
      width: '600px',
      data: {
        title: 'Dodaj termin nastave',
        fields: [
          { 
            name: 'vremePocetka', 
            label: 'Vreme početka', 
            type: 'datetime', 
            required: true
          },
          { 
            name: 'vremeZavrsetka', 
            label: 'Vreme završetka', 
            type: 'datetime', 
            required: true
          },
          { 
            name: 'realizacijaPredmetaId', 
            label: 'Predmet', 
            type: 'select', 
            required: true,
            options: realizacijeOptions
          },
          { 
            name: 'tipNastave', 
            label: 'Tip nastave', 
            type: 'select', 
            required: true,
            options: tipoviNastaveOptions
          },
          { 
            name: 'ishod', 
            label: 'Ishod', 
            type: 'select', 
            required: false,
            options: ishodiOptionsTermin
          }
        ]
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.realizacijaPredmetaId) {
          result.realizacijaPredmetaId = Number(result.realizacijaPredmetaId);
        }
        if (result.tipNastave) {
          const tipNastave = this.tipoviNastave.find(tip => tip.id === Number(result.tipNastave));
          result.tipNastave = tipNastave;
        }
        if (result.ishod) {
          const ishod = this.ishodi.find(i => i.id === Number(result.ishod));
          result.ishod = ishod;
        }
        
        this.terminNastaveService.create(result).subscribe({
          next: (response) => {
            this.snackBar.open('Termin nastave je uspešno kreiran', 'Zatvori', { duration: 3000 });
            this.loadData();
          },
          error: (error: any) => {
            console.error('Error creating termin nastave:', error);
            if (error?.status === 403 && this.authService.hasRole('studentska_sluzba')) {
              this.terminNastaveService.createForStudentskaSluzba(result).subscribe({
                next: (response) => {
                  this.snackBar.open('Termin nastave je uspešno kreiran', 'Zatvori', { duration: 3000 });
                  this.loadData();
                },
                error: (altError: any) => {
                  console.error('Error creating termin nastave through alternative endpoint:', altError);
                  this.snackBar.open('Greška pri kreiranju termina nastave. Kontaktirajte administratora.', 'Zatvori', { duration: 3000 });
                }
              });
            } else {
              this.snackBar.open('Greška pri kreiranju termina nastave', 'Zatvori', { duration: 3000 });
            }
          }
        });
      }
    });
  }
}
