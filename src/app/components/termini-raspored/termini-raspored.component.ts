import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';

import { GenericTableComponent, TableColumn, TableAction } from '../generic-table/generic-table.component';
import { GenericDialogComponent } from '../generic-dialog/generic-dialog.component';
import { DialogConfig } from '../generic-dialog/field-config.interface';
import { TerminNastaveService } from '../../services/terminNastave/termin-nastave.service';
import { IshodService } from '../../services/ishod/ishod.service';
import { TipNastaveService } from '../../services/tipNastave/tip-nastave.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { TerminNastave } from '../../models/terminNastave';
import { Ishod } from '../../models/ishod';
import { TipNastave } from '../../models/tipNastave';

@Component({
  selector: 'app-termini-raspored',
  standalone: true,
  imports: [CommonModule, GenericTableComponent],
  templateUrl: './termini-raspored.component.html',
  styleUrl: './termini-raspored.component.css'
})
export class TerminiRasporedComponent implements OnInit {
  termini: TerminNastave[] = [];
  ishodi: Ishod[] = [];
  availableIshodi: Ishod[] = [];
  tipoviNastave: TipNastave[] = [];
  loading = true;
  canAddTermin = true;

  columns: TableColumn[] = [
    { 
      key: 'vremePocetka', 
      label: 'Vreme početka', 
      pipe: 'date',
      pipeArgs: 'dd/MM/yyyy HH:mm'
    },
    { 
      key: 'vremeZavrsetka', 
      label: 'Vreme završetka', 
      pipe: 'date',
      pipeArgs: 'dd/MM/yyyy HH:mm'
    },
    { key: 'ishodInfo', label: 'Ishod' },
    { key: 'tipNastaveInfo', label: 'Tip nastave' }
  ];

  actions: TableAction[] = [
    {
      label: 'Izmeni',
      icon: 'edit',
      color: 'primary',
      action: (item: any) => this.handleEdit(item)
    },
    {
      label: 'Obriši',
      icon: 'delete',
      color: 'warn',
      action: (item: any) => this.handleDelete(item)
    }
  ];

  constructor(
    private terminNastaveService: TerminNastaveService,
    private ishodService: IshodService,
    private tipNastaveService: TipNastaveService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    
    forkJoin({
      termini: this.terminNastaveService.getAll(),
      ishodi: this.ishodService.getAll(),
      tipoviNastave: this.tipNastaveService.getAll()
    }).subscribe({
      next: (data) => {
        this.termini = data.termini.map((termin: any) => ({
          ...termin,
          ishodInfo: this.getIshodInfo(termin.ishod),
          tipNastaveInfo: this.getTipNastaveInfo(termin.tipNastave)
        }));
        this.ishodi = Array.from(data.ishodi);
        this.tipoviNastave = Array.from(data.tipoviNastave);
        
        this.filterAvailableIshodi();
        
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading data:', error);
        this.loading = false;
        this.snackBar.open('Greška pri učitavanju podataka', 'Zatvori', { duration: 3000 });
      }
    });
  }

  private getIshodInfo(ishod: Ishod): string {
    return ishod ? ishod.opis : 'N/A';
  }

  private getTipNastaveInfo(tipNastave: TipNastave): string {
    return tipNastave ? tipNastave.naziv : 'N/A';
  }

  private filterAvailableIshodi(): void {
    const assignedIshodIds = this.termini
      .map(termin => termin.ishod?.id)
      .filter(id => id !== undefined && id !== null) as number[];
    
    this.availableIshodi = this.ishodi.filter(ishod => 
      ishod.id !== undefined && !assignedIshodIds.includes(ishod.id)
    );
    
    this.canAddTermin = this.availableIshodi.length > 0;
  }

  handleAdd(): void {
    const dialogRef = this.dialog.open(GenericDialogComponent, {
      width: '600px',
      data: this.getDialogConfig(true)
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.ishodId) {
          result.ishod = { id: Number(result.ishodId) };
          delete result.ishodId;
        }
        if (result.tipNastaveId) {
          result.tipNastave = { id: Number(result.tipNastaveId) };
          delete result.tipNastaveId;
        }
        result.realizacijaPredmetaId = 1;

        this.terminNastaveService.create(result).subscribe({
          next: (response: any) => {
            this.snackBar.open('Termin je uspešno kreiran', 'Zatvori', { duration: 3000 });
            this.loadData();
          },
          error: (error: any) => {
            console.error('Error creating termin:', error);
            this.snackBar.open('Greška pri kreiranju termina', 'Zatvori', { duration: 3000 });
          }
        });
      }
    });
  }

  handleEdit(item: TerminNastave): void {
    const config = this.getDialogConfig(false, item);
    config.title = 'Izmeni termin nastave';
    config.data = {
      ...item,
      ishodId: item.ishod?.id,
      tipNastaveId: item.tipNastave?.id
    };

    const dialogRef = this.dialog.open(GenericDialogComponent, {
      width: '600px',
      data: config
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && item.id) {
        if (result.ishodId) {
          result.ishod = { id: Number(result.ishodId) };
          delete result.ishodId;
        }
        if (result.tipNastaveId) {
          result.tipNastave = { id: Number(result.tipNastaveId) };
          delete result.tipNastaveId;
        }
        result.id = item.id;
        result.realizacijaPredmetaId = 1;

        this.terminNastaveService.put(item.id, result).subscribe({
          next: (response: any) => {
            this.snackBar.open('Termin je uspešno ažuriran', 'Zatvori', { duration: 3000 });
            this.loadData();
          },
          error: (error: any) => {
            console.error('Error updating termin:', error);
            this.snackBar.open('Greška pri ažuriranju termina', 'Zatvori', { duration: 3000 });
          }
        });
      }
    });
  }

  handleDelete(item: TerminNastave): void {
    if (confirm('Da li ste sigurni da želite da obrišete ovaj termin?')) {
      if (item.id) {
        this.terminNastaveService.delete(item.id).subscribe({
          next: () => {
            this.snackBar.open('Termin je uspešno obrisan', 'Zatvori', { duration: 3000 });
            this.loadData();
          },
          error: (error: any) => {
            console.error('Error deleting termin:', error);
            this.snackBar.open('Greška pri brisanju termina', 'Zatvori', { duration: 3000 });
          }
        });
      }
    }
  }

  private getDialogConfig(isAdding: boolean = true, editingItem?: TerminNastave): DialogConfig {
    let ishodiToUse: Ishod[];
    
    if (isAdding) {
      ishodiToUse = this.availableIshodi;
    } else {
      ishodiToUse = [...this.availableIshodi];
      
      if (editingItem?.ishod && !ishodiToUse.find(i => i.id === editingItem.ishod?.id)) {
        ishodiToUse.push(editingItem.ishod);
      }
    }
    
    const ishodOptions = ishodiToUse.map(ishod => ({
      value: ishod.id,
      label: ishod.opis
    }));

    const tipNastaveOptions = this.tipoviNastave.map(tip => ({
      value: tip.id,
      label: tip.naziv
    }));

    return {
      title: 'Dodaj termin nastave',
      icon: 'schedule',
      fields: [
        {
          name: 'vremePocetka',
          type: 'datetime',
          label: 'Vreme početka',
          required: true,
          fullWidth: true
        },
        {
          name: 'vremeZavrsetka',
          type: 'datetime',
          label: 'Vreme završetka',
          required: true,
          fullWidth: true
        },
        {
          name: 'ishodId',
          type: 'select',
          label: 'Ishod',
          required: true,
          fullWidth: true,
          options: ishodOptions
        },
        {
          name: 'tipNastaveId',
          type: 'select',
          label: 'Tip nastave',
          required: true,
          fullWidth: true,
          options: tipNastaveOptions
        }
      ]
    };
  }
}
