import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { GenericTableComponent, TableColumn, TableAction } from '../generic-table/generic-table.component';
import { GenericDialogComponent } from '../generic-dialog/generic-dialog.component';
import { InstrumentEvaluacijeService } from '../../services/instrumentEvaluacije/instrument-evaluacije.service';
import { EvaluacijaZnanjaService } from '../../services/evaluacijaZnanja/evaluacija-znanja.service';
import { RealizacijaPredmetaService } from '../../services/realizacijaPredmeta/realizacija-predmeta.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { InstrumentEvaluacije } from '../../models/instrumentEvaluacije';
import { EvaluacijaZnanja } from '../../models/evaluacijaZnanja';
import { RealizacijaPredmeta } from '../../models/realizacijaPredmeta';

@Component({
  selector: 'app-instrumenti-evaluacije',
  standalone: true,
  imports: [CommonModule, GenericTableComponent],
  templateUrl: './instrumenti-evaluacije.component.html',
  styleUrls: ['./instrumenti-evaluacije.component.css']
})
export class InstrumentiEvaluacijeComponent implements OnInit {
  instrumentiDisplay: any[] = [];
  originalInstrumenti: InstrumentEvaluacije[] = [];
  evaluacijeZnanja: EvaluacijaZnanja[] = [];
  evaluacijeZnanjaDisplay: any[] = [];
  realizacijePredmeta: RealizacijaPredmeta[] = [];
  predmetInfo: any[] = [];
  
  columns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'opis', label: 'Opis instrumenta' },
    { key: 'evaluacijaInfo', label: 'Evaluacija' },
    { key: 'bodovi', label: 'Bodovi' },
    { key: 'vremePocetka', label: 'Vreme početka' },
    { key: 'vremeZavrsetka', label: 'Vreme završetka' }
  ];

  evaluacijeColumns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'bodovi', label: 'Bodovi' },
    { key: 'vremePocetka', label: 'Vreme početka' },
    { key: 'vremeZavrsetka', label: 'Vreme završetka' },
    { key: 'predmetInfo', label: 'Predmet' }
  ];
  actions: TableAction[] = [
    {
      label: 'Izmeni',
      icon: 'edit',
      color: 'accent',
      action: (item: any) => this.openEditDialog(item)
    },
    {
      label: 'Obriši',
      icon: 'delete',
      color: 'warn',
      action: (item: any) => this.deleteItem(item)
    }
  ];

  evaluacijeActions: TableAction[] = [
    {
      label: 'Izmeni',
      icon: 'edit',
      color: 'accent',
      action: (item: any) => this.openEditEvaluacijaDialog(item)
    },
    {
      label: 'Obriši',
      icon: 'delete',
      color: 'warn',
      action: (item: any) => this.deleteEvaluacija(item)
    }
  ];

  constructor(
    private instrumentEvaluacijeService: InstrumentEvaluacijeService,
    private evaluacijaZnanjaService: EvaluacijaZnanjaService,
    private realizacijaPredmetaService: RealizacijaPredmetaService,
    private authService: AuthenticationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadRealizacijePredmeta();
  }

  loadRealizacijePredmeta(): void {
    const nastavnikId = this.authService.getKorisnikId();
    if (nastavnikId) {
      this.realizacijaPredmetaService.getByNastavnikId(nastavnikId).subscribe({
        next: (data: RealizacijaPredmeta[]) => {
          this.realizacijePredmeta = data;
          this.loadPredmetInfo();
        },
        error: (error: any) => {
          console.error('Error loading realizacije predmeta:', error);
        }
      });
    }
  }

  loadPredmetInfo(): void {
    const nastavnikId = this.authService.getKorisnikId();
    if (nastavnikId) {
      this.realizacijaPredmetaService.getPredmetInfoByNastavnikId(nastavnikId).subscribe({
        next: (data: any[]) => {
          this.predmetInfo = data;
          this.loadEvaluacijeZnanja();
        },
        error: (error: any) => {
          console.error('Error loading predmet info:', error);
        }
      });
    }
  }

  loadEvaluacijeZnanja(): void {
    const nastavnikId = this.authService.getKorisnikId();
    if (nastavnikId) {
      this.evaluacijaZnanjaService.getByNastavnikId(nastavnikId).subscribe({
        next: (data: EvaluacijaZnanja[]) => {
          this.evaluacijeZnanja = data;
          this.loadData();
        },
        error: (error: any) => {
          console.error('Error loading evaluacije znanja:', error);
        }
      });
    }
  }

  loadData(): void {
    const nastavnikId = this.authService.getKorisnikId();
    if (nastavnikId) {
      this.instrumentEvaluacijeService.getByNastavnikId(nastavnikId).subscribe({
        next: (data: InstrumentEvaluacije[]) => {
          this.originalInstrumenti = data;
          this.instrumentiDisplay = data
            .filter(instrument => !instrument.obrisan)
            .map(instrument => {
            const evaluacija = this.evaluacijeZnanja.find(ev => ev.id === instrument.evaluacijaZnanjaId);
            return {
              ...instrument,
              evaluacijaInfo: evaluacija ? `Evaluacija ${evaluacija.id}` : 'N/A',
              bodovi: evaluacija?.bodovi || 0,
              vremePocetka: evaluacija?.vremePocetka || null,
              vremeZavrsetka: evaluacija?.vremeZavrsetka || null
            };
          });
        },
        error: (error: any) => {
          console.error('Error loading instrumenti evaluacije:', error);
        }
      });

      this.evaluacijeZnanjaDisplay = this.evaluacijeZnanja
        .filter(evaluacija => !evaluacija.obrisan)
        .map(evaluacija => {
        const predmet = this.predmetInfo.find(p => p.id === evaluacija.realizacijaPredmetaId);
        return {
          ...evaluacija,
          vremePocetka: evaluacija.vremePocetka || null,
          vremeZavrsetka: evaluacija.vremeZavrsetka || null,
          predmetInfo: predmet?.predmetNaziv || 'Nepoznat predmet'
        };
      });
    }
  }

  openCreateDialog(): void {
    const evaluacijeOptions = this.evaluacijeZnanja.map(ev => {
      const date = ev.vremePocetka ? new Date(ev.vremePocetka) : null;
      const formattedDate = date ? 
        date.toLocaleDateString('en-GB') + ' ' + date.toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit'}) : 
        'N/A';
      return {
        value: ev.id,
        label: `Evaluacija ${ev.id} - ${ev.bodovi} bodova (${formattedDate})`
      };
    });

    const dialogRef = this.dialog.open(GenericDialogComponent, {
      width: '600px',
      data: {
        title: 'Dodaj instrument evaluacije',
        fields: [
          { 
            name: 'opis', 
            label: 'Opis instrumenta', 
            type: 'text', 
            required: true
          },
          { 
            name: 'evaluacijaZnanjaId', 
            label: 'Evaluacija znanja', 
            type: 'select', 
            required: true,
            options: evaluacijeOptions
          }
        ]
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.evaluacijaZnanjaId) {
          result.evaluacijaZnanjaId = Number(result.evaluacijaZnanjaId);
        }
        this.instrumentEvaluacijeService.create(result).subscribe({
          next: (response) => {
            this.loadData();
          },
          error: (error: any) => {
            console.error('Error creating instrument evaluacije:', error);
          }
        });
      }
    });
  }

  openEditDialog(item: InstrumentEvaluacije): void {
    const evaluacijeOptions = this.evaluacijeZnanja.map(ev => {
      const date = ev.vremePocetka ? new Date(ev.vremePocetka) : null;
      const formattedDate = date ? 
        date.toLocaleDateString('en-GB') + ' ' + date.toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit'}) : 
        'N/A';
      return {
        value: ev.id,
        label: `Evaluacija ${ev.id} - ${ev.bodovi} bodova (${formattedDate})`
      };
    });

    const dialogRef = this.dialog.open(GenericDialogComponent, {
      width: '600px',
      data: {
        title: 'Izmeni instrument evaluacije',
        data: {
          opis: item.opis,
          evaluacijaZnanjaId: item.evaluacijaZnanjaId
        },
        fields: [
          { 
            name: 'opis', 
            label: 'Opis instrumenta', 
            type: 'text', 
            required: true
          },
          { 
            name: 'evaluacijaZnanjaId', 
            label: 'Evaluacija znanja', 
            type: 'select', 
            required: true, 
            options: evaluacijeOptions
          }
        ]
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && item.id) {
        if (result.evaluacijaZnanjaId) {
          result.evaluacijaZnanjaId = Number(result.evaluacijaZnanjaId);
        }
        this.instrumentEvaluacijeService.put(item.id, result).subscribe({
          next: (response) => {
            this.loadData();
          },
          error: (error: any) => {
            console.error('Error updating instrument evaluacije:', error);
          }
        });
      }
    });
  }

  deleteItem(item: any): void {
    const originalItem = this.originalInstrumenti.find(inst => inst.id === item.id);
    if (originalItem && confirm('Da li ste sigurni da želite da obrišete ovaj instrument evaluacije?')) {
      if (originalItem.id) {
        this.instrumentEvaluacijeService.delete(originalItem.id).subscribe({
          next: () => {
            this.loadData();
          },
          error: (error: any) => {
            console.error('Error deleting instrument evaluacije:', error);
          }
        });
      }
    }
  }

  onRowClick(item: any): void {
    const originalItem = this.originalInstrumenti.find(inst => inst.id === item.id);
    if (originalItem) {
      this.openEditDialog(originalItem);
    }
  }

  onAddClick(): void {
    this.openCreateDialog();
  }

  openCreateEvaluacijaDialog(): void {
    const realizacijeOptions = this.realizacijePredmeta.map(rp => {
      const predmet = this.predmetInfo.find(p => p.id === rp.id);
      return {
        value: rp.id,
        label: `${predmet?.predmetNaziv || 'Nepoznat predmet'} (${new Date().getFullYear()})`
      };
    });

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
          }
        ]
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.realizacijaPredmetaId) {
          result.realizacijaPredmetaId = Number(result.realizacijaPredmetaId);
        }
        this.evaluacijaZnanjaService.create(result).subscribe({
          next: (response) => {
            this.loadEvaluacijeZnanja();
          },
          error: (error: any) => {
            console.error('Error creating evaluacija znanja:', error);
          }
        });
      }
    });
  }

  openEditEvaluacijaDialog(item: EvaluacijaZnanja): void {
    const realizacijeOptions = this.realizacijePredmeta.map(rp => {
      const predmet = this.predmetInfo.find(p => p.id === rp.id);
      return {
        value: rp.id,
        label: `${predmet?.predmetNaziv || 'Nepoznat predmet'} (${new Date().getFullYear()})`
      };
    });

    const dialogRef = this.dialog.open(GenericDialogComponent, {
      width: '600px',
      data: {
        title: 'Izmeni evaluaciju znanja',
        data: {
          bodovi: item.bodovi,
          vremePocetka: item.vremePocetka,
          vremeZavrsetka: item.vremeZavrsetka,
          realizacijaPredmetaId: item.realizacijaPredmetaId
        },
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
          }
        ]
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && item.id) {
        if (result.realizacijaPredmetaId) {
          result.realizacijaPredmetaId = Number(result.realizacijaPredmetaId);
        }
        this.evaluacijaZnanjaService.put(item.id, result).subscribe({
          next: (response) => {
            this.loadEvaluacijeZnanja();
          },
          error: (error: any) => {
            console.error('Error updating evaluacija znanja:', error);
          }
        });
      }
    });
  }

  deleteEvaluacija(item: any): void {
    const originalItem = this.evaluacijeZnanja.find(evaluacija => evaluacija.id === item.id);
    if (originalItem && confirm('Da li ste sigurni da želite da obrišete ovu evaluaciju znanja?')) {
      if (originalItem.id) {
        this.evaluacijaZnanjaService.delete(originalItem.id).subscribe({
          next: () => {
            this.loadEvaluacijeZnanja();
          },
          error: (error: any) => {
            console.error('Error deleting evaluacija znanja:', error);
          }
        });
      }
    }
  }

  onEvaluacijaRowClick(item: any): void {
    const originalItem = this.evaluacijeZnanja.find(evaluacija => evaluacija.id === item.id);
    if (originalItem) {
      this.openEditEvaluacijaDialog(originalItem);
    }
  }

  onAddEvaluacijaClick(): void {
    this.openCreateEvaluacijaDialog();
  }
}
