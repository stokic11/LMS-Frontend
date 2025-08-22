import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { GenericTableComponent } from '../generic-table/generic-table.component';
import { Predmet } from '../../models/predmet';
import { PredmetService } from '../../services/predmet/predmet.service';

@Component({
  selector: 'app-predmet-table',
  standalone: true,
  imports: [CommonModule, GenericTableComponent, RouterModule],
  template: `
    <div class="predmet-table-wrapper">
      <h2 style="text-align:center; margin-bottom: 24px; color: #244855; font-weight: 600;">Predmeti</h2>
      <app-generic-table 
        [data]="data"
        [columns]="columns"
        [rowClickable]="true"
        (rowClick)="onPredmetClick($event)">
      </app-generic-table>
    </div>
  `,
  styleUrls: ['./predmet-table.component.css']
})
export class PredmetTableComponent implements OnInit {
  data: any[] = [];
  columns = [
    { key: 'naziv', label: 'Naziv' },
    { key: 'espb', label: 'ESPB' },
    { key: 'obavezan', label: 'Tip' },
    { key: 'brojSemestra', label: 'Semestar' },
    { key: 'brojPredavanja', label: 'Broj Predavanja' },
    { key: 'brojVezbi', label: 'Broj Vežbi' }
  ];

  constructor(
    private predmetService: PredmetService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.predmetService.getAll().subscribe({
      next: (predmeti) => {
        this.data = predmeti.map(predmet => ({
          ...predmet,
          obavezan: predmet.obavezan ? 'Obavezan' : 'Izborni'
        })) as any[];
      },
      error: (error) => {
        console.error('Error loading predmeti:', error);
      }
    });
  }

  onPredmetClick(predmet: any): void {
    if (predmet.id) {
      this.router.navigate(['/predmeti', predmet.id]);
    }
  }
}
