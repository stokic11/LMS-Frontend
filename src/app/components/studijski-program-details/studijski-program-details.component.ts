import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StudijskiProgramService } from '../../services/studijskiProgram/studijski-program.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { GenericDetailsComponent, InfoSection, TableSection } from '../generic-details/generic-details.component';

@Component({
  selector: 'app-studijski-program-details',
  imports: [
    CommonModule,
    GenericDetailsComponent
  ],
  templateUrl: './studijski-program-details.component.html',
  styleUrl: './studijski-program-details.component.css'
})
export class StudijskiProgramDetailsComponent implements OnInit, OnDestroy {
  programInfo: any = null;
  loading = true;
  error = false;
  programId: number = 0;
  returnUrl: string = '/studijski-programi';

  title: string = '';
  infoSections: InfoSection[] = [];
  tableSections: TableSection[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studijskiProgramService: StudijskiProgramService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.programId = +params['id'];
      this.loadProgramDetails();
    });

    this.route.queryParams.subscribe(queryParams => {
      this.determineReturnUrl(queryParams);
    });
  }

  private determineReturnUrl(queryParams: any): void {
    let userRoles = this.authService.getCurrentUserRoles();
    
    let fromAdmin = queryParams['from'] === 'admin';
    
    if (userRoles.includes('admin') && fromAdmin) {
      this.returnUrl = '/admin/studijski-programi';
    } else {
      this.returnUrl = '/studijski-programi';
    }
  }

  loadProgramDetails(): void {
    this.loading = true;
    this.error = false;

    this.studijskiProgramService.getStudijskiProgramInfo(this.programId).subscribe({
      next: (data) => {
        this.programInfo = data;
        this.setupGenericDetails();
        this.loading = false;
      },
      error: (error) => {
        console.error('Greška pri učitavanju detalja programa:', error);
        this.error = true;
        this.loading = false;
        alert('Greška pri učitavanju detalja programa iz baze. Proverite da li je backend pokrenut.');
      }
    });
  }

  setupGenericDetails(): void {
    if (!this.programInfo) return;

    this.title = this.programInfo.naziv;

    this.infoSections = [
      {
        title: 'Informacije o studijskom programu',
        icon: 'school',
        items: [
          { label: 'Naziv programa', value: this.programInfo.naziv },
          { label: 'Fakultet', value: this.programInfo.fakultet?.naziv || 'N/A' },
          { label: 'Adresa fakulteta', value: this.programInfo.fakultet?.adresa || 'N/A' }
        ]
      }
    ];

    if (this.programInfo.rukovodilac) {
      this.infoSections.push({
        title: 'Rukovodilac studijskog smera',
        icon: 'person',
        items: [
          { 
            label: 'Ime i prezime', 
            value: `${this.programInfo.rukovodilac.ime} ${this.programInfo.rukovodilac.prezime}` 
          },
          { label: 'Zvanje', value: this.programInfo.rukovodilac.zvanje || 'N/A' },
          { 
            label: 'Email', 
            value: this.programInfo.rukovodilac.email || 'N/A',
            type: 'email'
          },
          { 
            label: 'Biografija', 
            value: this.programInfo.rukovodilac.biografija || 'N/A',
            type: 'paragraph'
          }
        ]
      });
    }

    if (this.programInfo.godineStudija && this.programInfo.godineStudija.length > 0) {
      const allPredmeti: any[] = [];
      this.programInfo.godineStudija.forEach((godina: any, index: number) => {
        if (godina.predmeti) {
          godina.predmeti.forEach((predmet: any) => {
            allPredmeti.push({
              ...predmet,
              godinaIndex: index,
              obavezan: predmet.obavezan ? 'Obavezan' : 'Izborni'
            });
          });
        }
      });

      this.tableSections = [
        {
          title: 'Predmeti po godinama studija',
          icon: 'list',
          data: allPredmeti,
          displayedColumns: [
            'naziv', 'espb', 'obavezan', 'brojPredavanja', 'brojVezbi', 
            'drugiObliciNastave', 'istrazivackiRad', 'ostaliCasovi', 'brojSemestra'
          ],
          columnLabels: {
            'naziv': 'Naziv predmeta',
            'espb': 'ESPB',
            'obavezan': 'Tip',
            'brojPredavanja': 'Predavanja',
            'brojVezbi': 'Vežbe',
            'drugiObliciNastave': 'Drugi oblici nastave',
            'istrazivackiRad': 'Istraživački rad',
            'ostaliCasovi': 'Ostali časovi',
            'brojSemestra': 'Semestar'
          },
          expandable: true,
          groupBy: 'godinaIndex',
          groupLabelFunction: (group: any[], index: number) => `${index + 1}. godina studija`,
          groupDescriptionFunction: (group: any[]) => 
            `${group.length} predmeta • ${this.getTotalESPB(group)} ESPB`
        }
      ];
    }
  }

  getTotalESPB(predmeti: any[]): number {
    return predmeti?.reduce((total, predmet) => total + (predmet.espb || 0), 0) || 0;
  }

  goBack(): void {
    this.router.navigate([this.returnUrl]);
  }

  ngOnDestroy(): void {
  }
}
