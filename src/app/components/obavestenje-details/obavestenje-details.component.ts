import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Obavestenje } from '../../models/obavestenje';
import { ObavestenjeService } from '../../services/obavestenje/obavestenje.service';
import { GenericDetailsComponent, InfoSection, TableSection } from '../generic-details/generic-details.component';

@Component({
  selector: 'app-obavestenje-details',
  standalone: true,
  imports: [CommonModule, RouterModule, GenericDetailsComponent],
  templateUrl: './obavestenje-details.component.html',
  styleUrls: ['./obavestenje-details.component.css']
})
export class ObavestenjeDetailsComponent implements OnInit {
  obavestenje: any = null;
  loading = true;
  error = false;

  title: string = '';
  infoSections: InfoSection[] = [];
  tableSections: TableSection[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private obavestenjeService: ObavestenjeService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadObavestenje(+id);
    }
  }

  loadObavestenje(id: number): void {
    this.loading = true;
    this.error = false;

    this.obavestenjeService.getById(id).subscribe({
      next: (obavestenje) => {
        this.obavestenje = obavestenje;
        this.setupDetailsData();
        this.loading = false;
      },
      error: (error) => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  setupDetailsData(): void {
    if (!this.obavestenje) return;

    this.title = this.obavestenje.naslov || 'Obaveštenje';

    this.infoSections = [
      {
        title: 'Osnovne informacije',
        icon: 'info',
        items: [
          {
            label: 'Naslov',
            value: this.obavestenje.naslov,
            type: 'text'
          },
          {
            label: 'Sadržaj',
            value: this.obavestenje.sadrzaj,
            type: 'paragraph'
          },
          {
            label: 'Datum postavljanja',
            value: new Date(this.obavestenje.vremePostavljanja).toLocaleDateString('en-GB'),
            type: 'text'
          }
        ]
      }
    ];

    if (this.obavestenje.nazivPredmeta) {
      this.infoSections[0].items.push({
        label: 'Predmet',
        value: this.obavestenje.nazivPredmeta,
        type: 'text'
      });
    }

    this.tableSections = [];
  }
}
