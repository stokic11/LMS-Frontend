import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FakultetService } from '../../services/fakultet/fakultet.service';
import { AdresaService } from '../../services/adresa/adresa.service';
import { NastavnikService } from '../../services/nastavnik/nastavnik.service';
import { Fakultet } from '../../models/fakultet';
import { Nastavnik } from '../../models/nastavnik';
import { GenericDetailsComponent, InfoSection, TableSection } from '../generic-details/generic-details.component';

@Component({
  selector: 'app-fakultet-details',
  standalone: true,
  imports: [CommonModule, GenericDetailsComponent],
  templateUrl: './fakultet-details.component.html',
  styleUrl: './fakultet-details.component.css'
})
export class FakultetDetailsComponent implements OnInit {
  fakultetInfo: any = null;
  adresaInfo: any = null;
  dekan: Nastavnik | null = null;
  loading = true;
  error = false;

  title: string = '';
  infoSections: InfoSection[] = [];
  tableSections: TableSection[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private fakultetService: FakultetService,
    private adresaService: AdresaService,
    private nastavnikService: NastavnikService
  ) {}

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadFakultet(parseInt(id));
    }
  }

  loadFakultet(id: number): void {
    const fakultetInfo$ = this.fakultetService.getFakultetInfo(id);
    const fakultetDetails$ = this.fakultetService.getById(id);
    
    fakultetInfo$.subscribe({
      next: (infoData) => {
        this.fakultetInfo = infoData;
        this.error = false;
        
        fakultetDetails$.subscribe({
          next: (detailsData) => {
            this.fakultetInfo.adresa = detailsData.adresa;
            
            if (infoData && infoData.dekanId) {
              this.loadDekan(infoData.dekanId);
            } else {
              this.setupGenericDetails();
              this.loading = false;
            }
          },
          error: (error) => {
            if (infoData && infoData.dekanId) {
              this.loadDekan(infoData.dekanId);
            } else {
              this.setupGenericDetails();
              this.loading = false;
            }
          }
        });
      },
      error: (error) => {
        console.error('Greška pri učitavanju fakulteta iz backend-a:', error);
        console.error('Status:', error.status);
        console.error('Status text:', error.statusText);
        console.error('URL:', error.url);
        console.error('Message:', error.message);
      }
    });
  }

  loadDekan(dekanId: number): void {
    this.nastavnikService.getById(dekanId).subscribe({
      next: (data) => {
        this.dekan = data;
        this.setupGenericDetails();
        this.loading = false;
      },
      error: (error) => {
        console.error('Greška pri učitavanju dekana iz backend-a:', error);
      }
    });
  }

  setupGenericDetails(): void {
    if (!this.fakultetInfo) return;

    this.title = this.fakultetInfo.naziv;

    this.infoSections = [
      {
        title: 'Osnovne informacije o fakultetu',
        icon: 'school',
        items: [
          { label: 'Naziv fakulteta', value: this.fakultetInfo.naziv },
          { label: 'Univerzitet', value: this.fakultetInfo.univerzitetNaziv || 'N/A' }
        ]
      }
    ];

    if (this.fakultetInfo.adresa) {
      this.infoSections.push({
        title: 'Adresa fakulteta',
        icon: 'location_on',
        items: [
          { label: 'Ulica', value: `${this.fakultetInfo.adresa.ulica} ${this.fakultetInfo.adresa.broj}` },
          { label: 'Mesto', value: this.fakultetInfo.adresa.mesto?.naziv || 'N/A' },
          { label: 'Država', value: this.fakultetInfo.adresa.mesto?.drzava?.naziv || 'N/A' }
        ]
      });
    }

    if (this.dekan) {
      this.infoSections.push({
        title: 'Dekan fakulteta',
        icon: 'person',
        items: [
          { 
            label: 'Ime i prezime', 
            value: `${this.dekan.ime} ${this.dekan.prezime}` 
          },
          { label: 'Email', value: this.dekan.email || 'N/A', type: 'email' },
          { label: 'Biografija', value: this.dekan.biografija || 'N/A', type: 'paragraph' }
        ]
      });
    }

    if (this.fakultetInfo.studijskiProgrami && this.fakultetInfo.studijskiProgrami.length > 0) {
      this.tableSections = [
        {
          title: 'Studijski programi',
          icon: 'list',
          data: this.fakultetInfo.studijskiProgrami,
          displayedColumns: ['naziv'],
          columnLabels: {
            'naziv': 'Naziv studijskog programa'
          },
          expandable: false
        }
      ];
    }
  }

  goBack(): void {
    this.location.back();
  }
}
