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
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadFakultet(parseInt(id));
    }
  }

  loadFakultet(id: number): void {
    console.log('Pozivam getFakultetInfo za ID:', id);
    
    const fakultetInfo$ = this.fakultetService.getFakultetInfo(id);
    const fakultetDetails$ = this.fakultetService.getById(id);
    
    fakultetInfo$.subscribe({
      next: (infoData) => {
        console.log('Uspešno dobijeni info podaci o fakultetu:', infoData);
        this.fakultetInfo = infoData;
        this.error = false;
        
        fakultetDetails$.subscribe({
          next: (detailsData) => {
            console.log('Uspešno dobijeni detalji fakulteta sa adresom:', detailsData);
            this.fakultetInfo.adresa = detailsData.adresa;
            
            if (infoData && infoData.dekanId) {
              console.log('Pozivam loadDekan za dekanId:', infoData.dekanId);
              this.loadDekan(infoData.dekanId);
            } else {
              console.log('Nema dekanId u podacima, završavam loading');
              this.setupGenericDetails();
              this.loading = false;
            }
          },
          error: (error) => {
            console.error('Greška pri učitavanju detalja fakulteta:', error);
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
        console.log('Koristim mock podatke kao fallback');
        this.loadMockData(id);
      }
    });
  }

  private loadMockData(id: number): void {
    const mockData = [
      {
        id: 1,
        naziv: 'Fakultet informatike i računarstva',
        univerzitetId: 1,
        univerzitetNaziv: 'Univerzitet Metropolitan',
        dekanId: 1,
        dekanIme: 'Prof. dr Marko Petković',
        studijskiProgramiIds: [1, 2],
        studijskiProgramiNazivi: 'Softversko inženjerstvo, Informacione tehnologije',
        adresa: {
          id: 1,
          ulica: 'Trg Dositeja Obradovića',
          broj: '6',
          mesto: {
            id: 1,
            naziv: 'Novi Sad',
            drzava: {
              id: 1,
              naziv: 'Srbija'
            }
          }
        }
      },
      {
        id: 2,
        naziv: 'Poslovni fakultet',
        univerzitetId: 1,
        univerzitetNaziv: 'Univerzitet Metropolitan',
        dekanId: 2,
        dekanIme: 'Prof. dr Ana Nikolić',
        studijskiProgramiIds: [3],
        studijskiProgramiNazivi: 'Menadžment',
        adresa: {
          id: 2,
          ulica: 'Tadeuša Košćuška',
          broj: '63',
          mesto: {
            id: 1,
            naziv: 'Novi Sad',
            drzava: {
              id: 1,
              naziv: 'Srbija'
            }
          }
        }
      },
      {
        id: 3,
        naziv: 'Fakultet za medije i komunikacije',
        univerzitetId: 1,
        univerzitetNaziv: 'Univerzitet Metropolitan',
        dekanId: 3,
        dekanIme: 'Prof. dr Stefan Jovanović',
        studijskiProgramiIds: [4, 5],
        studijskiProgramiNazivi: 'Digitalne komunikacije, Medijski menadžment',
        adresa: {
          id: 3,
          ulica: 'Bulevar oslobođenja',
          broj: '76',
          mesto: {
            id: 1,
            naziv: 'Novi Sad',
            drzava: {
              id: 1,
              naziv: 'Srbija'
            }
          }
        }
      }
    ];

    const fakultetData = mockData.find(f => f.id === id);
    if (fakultetData) {
      this.fakultetInfo = fakultetData;
      if (fakultetData.dekanId) {
        this.loadMockDekan(fakultetData.dekanId);
      } else {
        this.setupGenericDetails();
        this.loading = false;
      }
    } else {
      this.error = true;
      this.loading = false;
    }
  }

  private loadMockDekan(dekanId: number): void {
    const mockDekani = [
      {
        id: 1,
        ime: 'Prof. dr Marko Petković',
        email: 'marko.petkovic@fir.rs',
        biografija: 'Prof. dr Marko Petković je redovni profesor na Fakultetu informatike i računarstva sa preko 20 godina iskustva u nastavi i istraživanju.',
        zvanje: {
          tipZvanja: { naziv: 'Redovni profesor' },
          naucnaOblast: { naziv: 'Informatika' }
        }
      },
      {
        id: 2,
        ime: 'Prof. dr Ana Nikolić',
        email: 'ana.nikolic@poslovni.rs',
        biografija: 'Prof. dr Ana Nikolić je dekan Poslovnog fakulteta i priznati ekspert u oblasti strategijskog menadžmenta.',
        zvanje: {
          tipZvanja: { naziv: 'Redovni profesor' },
          naucnaOblast: { naziv: 'Menadžment' }
        }
      },
      {
        id: 3,
        ime: 'Prof. dr Stefan Jovanović',
        email: 'stefan.jovanovic@fmk.rs',
        biografija: 'Prof. dr Stefan Jovanović je dekan Fakulteta za medije i komunikacije, specijalizovan za digitalnu komunikaciju.',
        zvanje: {
          tipZvanja: { naziv: 'Vanredni profesor' },
          naucnaOblast: { naziv: 'Komunikacije' }
        }
      }
    ];

    const dekanData = mockDekani.find(d => d.id === dekanId);
    if (dekanData) {
      this.dekan = dekanData as any;
    }
    this.setupGenericDetails();
    this.loading = false;
  }

  loadDekan(dekanId: number): void {
    console.log('Pozivam backend za dekana ID:', dekanId);
    this.nastavnikService.getById(dekanId).subscribe({
      next: (data) => {
        console.log('Uspešno dobijeni podaci o dekanu iz backend-a:', data);
        this.dekan = data;
        this.setupGenericDetails();
        this.loading = false;
      },
      error: (error) => {
        console.error('Greška pri učitavanju dekana iz backend-a:', error);
        console.log('Koristim mock podatke za dekana kao fallback');
        this.loadMockDekan(dekanId);
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
