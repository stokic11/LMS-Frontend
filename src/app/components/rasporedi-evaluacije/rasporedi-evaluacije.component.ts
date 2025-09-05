import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { EvaluacijaZnanjaService } from '../../services/evaluacijaZnanja/evaluacija-znanja.service';
import { TerminNastaveService } from '../../services/terminNastave/termin-nastave.service';
import { RealizacijaPredmetaService } from '../../services/realizacijaPredmeta/realizacija-predmeta.service';
import { PredmetService } from '../../services/predmet/predmet.service';
import { TipEvaluacijeService } from '../../services/tipEvaluacije/tip-evaluacije.service';
import { TipNastaveService } from '../../services/tipNastave/tip-nastave.service';
import { IshodService } from '../../services/ishod/ishod.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { XmlService } from '../../services/xml.service';
import { EvaluacijaZnanja } from '../../models/evaluacijaZnanja';
import { TerminNastave } from '../../models/terminNastave';
import { RealizacijaPredmeta } from '../../models/realizacijaPredmeta';
import { Predmet } from '../../models/predmet';
import { TipEvaluacije } from '../../models/tipEvaluacije';
import { TipNastave } from '../../models/tipNastave';
import { Ishod } from '../../models/ishod';
import { GenericTableComponent, TableColumn, TableAction } from '../generic-table/generic-table.component';
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
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
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
  isStudentskaSluzba = false;
  
  showXmlUpload = false;
  selectedFile: File | null = null;
  xmlContent: string = '';
  isDragOver = false;
  
  xmlExample = `<?xml version="1.0" encoding="UTF-8"?>
<rezultatiEvaluacije>
    <rezultat>
        <studentIndex>20200001</studentIndex>
        <realizacijaId>1</realizacijaId>
        <bodovi>85.5</bodovi>
        <tipEvaluacije>kolokvijum</tipEvaluacije>
    </rezultat>
    <rezultat>
        <studentIndex>20200002</studentIndex>
        <realizacijaId>1</realizacijaId>
        <bodovi>92.0</bodovi>
        <tipEvaluacije>ispit</tipEvaluacije>
    </rezultat>
</rezultatiEvaluacije>`;
  
  evaluacijeActions: TableAction[] = [];
  terminiActions: TableAction[] = []; 
  
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
    private authService: AuthenticationService,
    private xmlService: XmlService
  ) {}

  ngOnInit(): void {
    this.checkUserRole();
    this.initializeActions();
    this.loadData();
  }

  checkUserRole(): void {
    let roles = this.authService.getCurrentUserRoles();
    this.isStudentskaSluzba = roles.includes('studentska_sluzba');
  }

  initializeActions(): void {
    if (this.isStudentskaSluzba) {
      this.evaluacijeActions = [
        {
          label: 'Izmeni',
          icon: 'edit',
          color: 'accent',
          action: (evaluacija: any) => this.izmeniEvaluaciju(evaluacija)
        },
        {
          label: 'Obriši',
          icon: 'delete',
          color: 'warn',
          action: (evaluacija: any) => this.obrisiEvaluaciju(evaluacija)
        }
      ];

      this.terminiActions = [
        {
          label: 'Izmeni',
          icon: 'edit',
          color: 'accent',
          action: (termin: any) => this.izmeniTermin(termin)
        },
        {
          label: 'Obriši',
          icon: 'delete',
          color: 'warn',
          action: (termin: any) => this.obrisiTermin(termin)
        }
      ];
    }
  }

  async loadData(): Promise<void> {
    this.loading = true;
    try {
      this.predmeti = [];
      this.tipoviEvaluacije = [];
      this.tipoviNastave = [];
      this.realizacijePredmeta = [];
      this.evaluacijeZnanja = [];
      this.terminiNastave = [];
      this.ishodi = [];

      try {
        let tipoviEvaluacijeResponse = await firstValueFrom(
          this.tipEvaluacijeService.getAll()
        );
        this.tipoviEvaluacije = tipoviEvaluacijeResponse;
      } catch (error: any) {
        if (error?.status === 403) {
          console.log('Tipovi evaluacije nisu dostupni studentskoj službi (403 Forbidden)');
        } else {
          console.log('Tipovi evaluacije nisu dostupni studentskoj službi:', error?.message || 'Unknown error');
        }
      }

      try {
        let tipoviNastaveResponse = await firstValueFrom(
          this.tipNastaveService.getAll()
        );
        this.tipoviNastave = tipoviNastaveResponse;
      } catch (error: any) {
        if (error?.status === 403) {
          console.log('Tipovi nastave nisu dostupni studentskoj službi (403 Forbidden)');
        } else {
          console.log('Tipovi nastave nisu dostupni studentskoj službi:', error?.message || 'Unknown error');
        }
      }

      try {
        let predmetiResponse = await firstValueFrom(
          this.predmetService.getAll()
        );
        this.predmeti = predmetiResponse;
      } catch (error) {
        console.log('Predmeti nisu dostupni studentskoj službi:', error);
      }

      try {
        let realizacijeResponse = await firstValueFrom(
          this.realizacijaPredmetaService.getAll()
        );
        this.realizacijePredmeta = realizacijeResponse;
      } catch (error) {
        console.log('Realizacije predmeta nisu dostupne studentskoj službi:', error);
      }

      try {
        let ishodiResponse = await firstValueFrom(
          this.ishodService.getAll()
        );
        this.ishodi = ishodiResponse;
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
          } catch (specificError: any) {
            try {
              evaluacijeResponse = await firstValueFrom(
                this.evaluacijaZnanjaService.getAllEvaluacije()
              );
            } catch (altError: any) {
              evaluacijeResponse = await firstValueFrom(
                this.evaluacijaZnanjaService.getAll()
              );
            }
          }
        } else {
          evaluacijeResponse = await firstValueFrom(
            this.evaluacijaZnanjaService.getAll()
          );
        }
        
        this.evaluacijeZnanja = this.mapEvaluacijeWithPredmeti(evaluacijeResponse)
          .filter(evaluacija => !evaluacija.obrisan);
      } catch (error: any) {
        if (error?.status === 403) {
          console.log('Evaluacije znanja nisu dostupne studentskoj službi (403 Forbidden)');
        } else {
          console.log('Evaluacije znanja nisu dostupne studentskoj službi:', error?.message || 'Unknown error');
        }
        this.evaluacijeZnanja = [];
      }

      try {
        let terminiResponse = await firstValueFrom(
          this.terminNastaveService.getAll()
        );
        this.terminiNastave = this.mapTerminiWithPredmeti(terminiResponse)
          .filter(termin => !termin.obrisan);
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
      let realizacija = this.realizacijePredmeta.find(r => r.id === evaluacija.realizacijaPredmetaId);
      let predmet = this.predmeti.find(p => p.id === realizacija?.predmetId);
      
      let tipEvaluacijeNaziv = 'Nepoznat tip';
      
      if (evaluacija.tipEvaluacije) {
        if (typeof evaluacija.tipEvaluacije === 'object' && evaluacija.tipEvaluacije.naziv) {
          tipEvaluacijeNaziv = evaluacija.tipEvaluacije.naziv;
        } else if (typeof evaluacija.tipEvaluacije === 'object' && evaluacija.tipEvaluacije.id) {
          let tipEvaluacije = this.tipoviEvaluacije.find(t => t.id === evaluacija.tipEvaluacije.id);
          tipEvaluacijeNaziv = tipEvaluacije?.naziv || 'Nepoznat tip';
        } else if (typeof evaluacija.tipEvaluacije === 'number') {
          let tipId = evaluacija.tipEvaluacije as any as number;
          let tipEvaluacije = this.tipoviEvaluacije.find(t => t.id === tipId);
          tipEvaluacijeNaziv = tipEvaluacije?.naziv || 'Nepoznat tip';
        }
      }
      
      if (tipEvaluacijeNaziv === 'Nepoznat tip' && this.tipoviEvaluacije.length > 0) {
        let evaluacijaId = evaluacija.id || 0;
        let tipIndex = (evaluacijaId - 1) % this.tipoviEvaluacije.length;
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
      let realizacija = this.realizacijePredmeta.find(r => r.id === termin.realizacijaPredmetaId);
      let predmet = this.predmeti.find(p => p.id === realizacija?.predmetId);
      
      let tipNastaveNaziv = 'Nepoznat tip';
      if (termin.tipNastave?.naziv) {
        tipNastaveNaziv = termin.tipNastave.naziv;
      } else if (termin.tipNastave?.id) {
        let tipNastave = this.tipoviNastave.find(t => t.id === termin.tipNastave.id);
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

    let realizacijeOptions = this.realizacijePredmeta.map(rp => {
      let predmet = this.predmeti.find(p => p.id === rp.predmetId);
      return {
        value: rp.id,
        label: `${predmet?.naziv || 'Nepoznat predmet'} (Realizacija ${rp.id})`
      };
    });

    let tipoviEvaluacijeOptions = this.tipoviEvaluacije.map(tip => ({
      value: tip.id,
      label: tip.naziv
    }));

    let ishodiOptions = this.ishodi.map(ishod => ({
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
          let tipEvaluacije = this.tipoviEvaluacije.find(tip => tip.id === Number(result.tipEvaluacije));
          result.tipEvaluacije = tipEvaluacije;
        }
        if (result.ishod) {
          let ishod = this.ishodi.find(i => i.id === Number(result.ishod));
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

    let realizacijeOptions = this.realizacijePredmeta.map(rp => {
      let predmet = this.predmeti.find(p => p.id === rp.predmetId);
      return {
        value: rp.id,
        label: `${predmet?.naziv || 'Nepoznat predmet'} (Realizacija ${rp.id})`
      };
    });

    let tipoviNastaveOptions = this.tipoviNastave.map(tip => ({
      value: tip.id,
      label: tip.naziv
    }));

    let ishodiOptionsTermin = this.ishodi.map(ishod => ({
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

  async izmeniEvaluaciju(evaluacija: any): Promise<void> {
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
      this.snackBar.open('Nema dostupnih realizacija predmeta', 'Zatvori', { duration: 3000 });
      return;
    }

    if (tipoviEvaluacijeOptions.length === 0) {
      this.snackBar.open('Nema dostupnih tipova evaluacije', 'Zatvori', { duration: 3000 });
      return;
    }

    const extractedTipId = this.extractTipEvaluacijeId(evaluacija);

    const dialogData = {
      bodovi: evaluacija.bodovi,
      vremePocetka: this.formatDateForInput(evaluacija.vremePocetka),
      vremeZavrsetka: this.formatDateForInput(evaluacija.vremeZavrsetka),
      realizacijaPredmetaId: evaluacija.realizacijaPredmetaId,
      tipEvaluacije: extractedTipId,
      ishod: evaluacija.ishod?.id
    };
    
    const dialogRef = this.dialog.open(GenericDialogComponent, {
      width: '600px',
      data: {
        title: 'Izmeni evaluaciju znanja',
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
        ],
        data: dialogData
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const updateData: any = {
          id: evaluacija.id,
          bodovi: Number(result.bodovi),
          vremePocetka: result.vremePocetka,
          vremeZavrsetka: result.vremeZavrsetka,
          realizacijaPredmetaId: Number(result.realizacijaPredmetaId),
          tipEvaluacije: result.tipEvaluacije ? { id: Number(result.tipEvaluacije) } : null,
          ishod: result.ishod ? { id: Number(result.ishod) } : null,
          obrisan: evaluacija.obrisan || false,
          datumBrisanja: evaluacija.datumBrisanja
        };
        
        this.evaluacijaZnanjaService.updateForStudentskaSluzba(evaluacija.id, updateData).subscribe({
          next: (response) => {
            this.snackBar.open('Evaluacija znanja je uspešno izmenjena', 'Zatvori', { duration: 3000 });
            this.loadData();
          },
          error: (error: any) => {
            console.error('Error updating evaluacija znanja:', error);
            this.snackBar.open('Greška pri izmeni evaluacije znanja', 'Zatvori', { duration: 3000 });
          }
        });
      }
    });
  }

  async obrisiEvaluaciju(evaluacija: any): Promise<void> {
    const dialogRef = this.dialog.open(GenericDialogComponent, {
      width: '400px',
      data: {
        title: 'Potvrdi brisanje',
        subtitle: `Da li ste sigurni da želite da obrišete evaluaciju znanja sa ${evaluacija.bodovi} bodova?`,
        fields: [
          {
            name: 'confirmation',
            label: 'Potvrdite brisanje',
            type: 'dynamic-text',
            dynamicText: () => 'Ova akcija se ne može poništiti.'
          }
        ],
        customSave: async (formValue: any) => {
          try {
            await firstValueFrom(this.evaluacijaZnanjaService.delete(evaluacija.id));
            this.snackBar.open('Evaluacija znanja je uspešno obrisana!', 'Zatvori', { duration: 3000 });
            return true;
          } catch (error) {
            this.snackBar.open('Greška pri brisanju evaluacije znanja', 'Zatvori', { duration: 3000 });
            throw error;
          }
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  async izmeniTermin(termin: any): Promise<void> {
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
      this.snackBar.open('Nema dostupnih realizacija predmeta', 'Zatvori', { duration: 3000 });
      return;
    }

    if (tipoviNastaveOptions.length === 0) {
      this.snackBar.open('Nema dostupnih tipova nastave', 'Zatvori', { duration: 3000 });
      return;
    }

    const extractedTipId = this.extractTipNastaveId(termin);

    const dialogData = {
      vremePocetka: this.formatDateForInput(termin.vremePocetka),
      vremeZavrsetka: this.formatDateForInput(termin.vremeZavrsetka),
      realizacijaPredmetaId: termin.realizacijaPredmetaId,
      tipNastave: extractedTipId,
      ishod: termin.ishod?.id
    };
    
    const dialogRef = this.dialog.open(GenericDialogComponent, {
      width: '600px',
      data: {
        title: 'Izmeni termin nastave',
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
        ],
        data: dialogData
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const updateData: any = {
          id: termin.id,
          vremePocetka: result.vremePocetka,
          vremeZavrsetka: result.vremeZavrsetka,
          realizacijaPredmetaId: Number(result.realizacijaPredmetaId),
          tipNastave: result.tipNastave ? { id: Number(result.tipNastave) } : null,
          ishod: result.ishod ? { id: Number(result.ishod) } : null,
          obrisan: termin.obrisan || false,
          datumBrisanja: termin.datumBrisanja
        };
        
        this.terminNastaveService.updateForStudentskaSluzba(termin.id, updateData).subscribe({
          next: (response) => {
            this.snackBar.open('Termin nastave je uspešno izmenjen', 'Zatvori', { duration: 3000 });
            this.loadData();
          },
          error: (error: any) => {
            console.error('Error updating termin nastave:', error);
            this.snackBar.open('Greška pri izmeni termina nastave', 'Zatvori', { duration: 3000 });
          }
        });
      }
    });
  }

  async obrisiTermin(termin: any): Promise<void> {
    const dialogRef = this.dialog.open(GenericDialogComponent, {
      width: '400px',
      data: {
        title: 'Potvrdi brisanje',
        subtitle: `Da li ste sigurni da želite da obrišete termin nastave (${termin.tipNastaveNaziv})?`,
        fields: [
          {
            name: 'confirmation',
            label: 'Potvrdite brisanje',
            type: 'dynamic-text',
            dynamicText: () => 'Ova akcija se ne može poništiti.'
          }
        ],
        customSave: async (formValue: any) => {
          try {
            await firstValueFrom(this.terminNastaveService.delete(termin.id));
            this.snackBar.open('Termin nastave je uspešno obrisan!', 'Zatvori', { duration: 3000 });
            return true;
          } catch (error) {
            this.snackBar.open('Greška pri brisanju termina nastave', 'Zatvori', { duration: 3000 });
            throw error;
          }
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  private formatDateForInput(dateValue: any): string {
    if (!dateValue) return '';
    
    try {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return '';
      
      
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (error) {
      console.warn('Error formatting date:', error);
      return '';
    }
  }

  private extractTipEvaluacijeId(evaluacija: any): number | undefined {
    if (!evaluacija.tipEvaluacije) return undefined;
    
    if (typeof evaluacija.tipEvaluacije === 'number') {
      return evaluacija.tipEvaluacije;
    }
    
    if (typeof evaluacija.tipEvaluacije === 'object' && evaluacija.tipEvaluacije.id) {
      return evaluacija.tipEvaluacije.id;
    }
    
    if (typeof evaluacija.tipEvaluacije === 'object' && evaluacija.tipEvaluacije.naziv) {
      const tip = this.tipoviEvaluacije.find(t => t.naziv === evaluacija.tipEvaluacije.naziv);
      return tip?.id;
    }
    
    return undefined;
  }

  private extractTipNastaveId(termin: any): number | undefined {
    if (!termin.tipNastave) return undefined;
    
    if (typeof termin.tipNastave === 'number') {
      return termin.tipNastave;
    }
    
    if (typeof termin.tipNastave === 'object' && termin.tipNastave.id) {
      return termin.tipNastave.id;
    }
    
    if (typeof termin.tipNastave === 'object' && termin.tipNastave.naziv) {
      const tip = this.tipoviNastave.find(t => t.naziv === termin.tipNastave.naziv);
      return tip?.id;
    }
    
    return undefined;
  }

  toggleXmlUpload(): void {
    this.showXmlUpload = !this.showXmlUpload;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadFile(): void {
    if (this.selectedFile) {
      this.xmlService.uploadXmlFile(this.selectedFile).subscribe({
        next: (response) => {
          this.snackBar.open(response.message, 'Zatvori', { duration: 3000 });
          this.selectedFile = null;
          this.loadData();
        },
        error: (error) => {
          this.snackBar.open(error.error.error || 'Greška pri upload-u', 'Zatvori', { duration: 5000 });
        }
      });
    }
  }

  submitXmlContent(): void {
    if (this.xmlContent) {
      this.xmlService.submitXmlContent(this.xmlContent).subscribe({
        next: (response) => {
          this.snackBar.open(response.message, 'Zatvori', { duration: 3000 });
          this.xmlContent = '';
          this.loadData();
        },
        error: (error) => {
          this.snackBar.open(error.error.error || 'Greška pri obradi XML-a', 'Zatvori', { duration: 5000 });
        }
      });
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'text/xml' || file.name.endsWith('.xml')) {
        this.selectedFile = file;
      } else {
        this.snackBar.open('Molimo izaberite XML fajl', 'Zatvori', { duration: 3000 });
      }
    }
  }

  clearSelectedFile(): void {
    this.selectedFile = null;
    const fileInput = document.getElementById('xmlFileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}
