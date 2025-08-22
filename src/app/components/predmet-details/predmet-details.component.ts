import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Predmet } from '../../models/predmet';
import { NastavniMaterijal } from '../../models/nastavniMaterijal';
import { PredmetService } from '../../services/predmet/predmet.service';
import { NastavniMaterijalService } from '../../services/nastavniMaterijal/nastavni-materijal.service';
import { GenericDetailsComponent, InfoSection, TableSection } from '../generic-details/generic-details.component';

@Component({
  selector: 'app-predmet-details',
  standalone: true,
  imports: [CommonModule, RouterModule, GenericDetailsComponent],
  templateUrl: './predmet-details.component.html',
  styleUrls: ['./predmet-details.component.css']
})
export class PredmetDetailsComponent implements OnInit {
  predmet: Predmet | null = null;
  nastavniMaterijali: NastavniMaterijal[] = [];
  loading = true;
  error = false;

  title: string = '';
  infoSections: InfoSection[] = [];
  tableSections: TableSection[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private predmetService: PredmetService,
    private nastavniMaterijalService: NastavniMaterijalService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPredmet(+id);
    }
  }

  loadPredmet(id: number): void {
    this.loading = true;
    this.error = false;

    this.predmetService.getById(id).subscribe({
      next: (predmet) => {
        this.predmet = predmet;
        this.loadNastavniMaterijal();
      },
      error: (error) => {
        console.error('Error loading predmet:', error);
        this.error = true;
        this.loading = false;
        alert('Greška pri učitavanju predmeta. Proverite da li je backend pokrenut.');
      }
    });
  }

  loadNastavniMaterijal(): void {
    if (this.predmet?.id) {
      this.nastavniMaterijalService.getByPredmetId(this.predmet.id).subscribe({
        next: (materijali: any[]) => {
          this.nastavniMaterijali = materijali.map((item: any) => ({
            id: item.id,
            naziv: item.naziv,
            autori: item.autori,
            godinaIzdavanja: new Date(item.godinIzdavanja),
            ishodiIds: item.ishodiIds,
            fajloviIds: item.fajloviIds
          }));
          
          this.setupGenericDetails();
          this.loading = false;
        },
        error: (error) => {
          this.nastavniMaterijali = [];
          this.setupGenericDetails();
          this.loading = false;
        }
      });
    } else {
      this.nastavniMaterijali = [];
      this.setupGenericDetails();
      this.loading = false;
    }
  }

  setupGenericDetails(): void {
    if (!this.predmet) return;

    this.title = this.predmet.naziv;

    this.infoSections = [];
    this.tableSections = [];

    if (this.predmet.silabus && this.predmet.silabus.length > 0) {
      const ishodiData = this.predmet.silabus.map((ishod, index) => ({
        redni_broj: index + 1,
        opis: ishod.opis,
        obrazovni_cilj: ishod.obrazovniCilj?.opis || 'N/A'
      }));

      this.tableSections.push({
        title: 'Silabus',
        icon: 'school',
        data: ishodiData,
        displayedColumns: ['opis', 'obrazovni_cilj'],
        columnLabels: {
          'opis': 'Ishod',
          'obrazovni_cilj': 'Obrazovni cilj'
        }
      });
    } else {
      this.tableSections.push({
        title: 'Silabus',
        icon: 'warning',
        data: [],
        displayedColumns: [],
        columnLabels: {}
      });
    }

    if (this.nastavniMaterijali && this.nastavniMaterijali.length > 0) {
      const materijalData = this.nastavniMaterijali.map(materijal => {        
        let godina = 'N/A';
        if (materijal.godinaIzdavanja) {
          if (materijal.godinaIzdavanja instanceof Date && !isNaN(materijal.godinaIzdavanja.getTime())) {
            godina = materijal.godinaIzdavanja.getFullYear().toString();
          }
        }
        
        return {
          naziv: materijal.naziv,
          autori: materijal.autori,
          godina: godina
        };
      });

      this.tableSections.push({
        title: 'Nastavni materijal',
        icon: 'library_books',
        data: materijalData,
        displayedColumns: ['naziv', 'autori', 'godina'],
        columnLabels: {
          'naziv': 'Naziv',
          'autori': 'Autori',
          'godina': 'Godina izdavanja'
        }
      });
    } else {
      this.tableSections.push({
        title: 'Nastavni materijal',
        icon: 'info',
        data: [],
        displayedColumns: [],
        columnLabels: {}
      });
    }
  }


  goBack(): void {
    this.router.navigate(['/predmeti']);
  }
}
