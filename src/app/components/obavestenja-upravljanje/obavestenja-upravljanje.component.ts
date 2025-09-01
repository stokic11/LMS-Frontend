import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { firstValueFrom } from 'rxjs';

import { GenericTableComponent } from '../generic-table/generic-table.component';
import { Obavestenje } from '../../models/obavestenje';
import { ObavestenjeService } from '../../services/obavestenje/obavestenje.service';
import { RealizacijaPredmetaService } from '../../services/realizacijaPredmeta/realizacija-predmeta.service';
import { PredmetService } from '../../services/predmet/predmet.service';
import { NastavnikNaRealizacijiService } from '../../services/nastavnikNaRealizaciji/nastavnik-na-realizaciji.service';
import { NastavnikService } from '../../services/nastavnik/nastavnik.service';
import { ObavestenjeDialogComponent } from '../obavestenje-dialog/obavestenje-dialog.component';

@Component({
  selector: 'app-obavestenja-upravljanje',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    MatProgressSpinnerModule,
    GenericTableComponent
  ],
  templateUrl: './obavestenja-upravljanje.component.html',
  styleUrls: ['./obavestenja-upravljanje.component.css']
})
export class ObavestenjaUpravljanjeComponent implements OnInit {
  obavestenja: any[] = [];
  realizacijePredmeta: any[] = [];
  predmeti: any[] = [];
  nastavniciNaRealizaciji: any[] = [];
  nastavnici: any[] = [];
  loading = false;

  obavestenjaColumns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'naslov', label: 'Naslov', sortable: true },
    { key: 'sadrzaj', label: 'Sadržaj', sortable: false },
    { key: 'predmet', label: 'Predmet', sortable: true },
    { key: 'nastavnik', label: 'Nastavnik', sortable: true },
    { key: 'vremePostavljanja', label: 'Vreme postavljanja', sortable: true, type: 'date' }
  ];

  constructor(
    private obavestenjeService: ObavestenjeService,
    private realizacijaPredmetaService: RealizacijaPredmetaService,
    private predmetService: PredmetService,
    private nastavnikNaRealizacijiService: NastavnikNaRealizacijiService,
    private nastavnikService: NastavnikService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    this.loading = true;
    try {
      // Load predmete
      const predmetiResponse = await firstValueFrom(
        this.predmetService.getAll()
      );
      this.predmeti = predmetiResponse;

      // Load realizacije predmeta
      const realizacijeResponse = await firstValueFrom(
        this.realizacijaPredmetaService.getAll()
      );
      this.realizacijePredmeta = realizacijeResponse as any[];

      // Try to load nastavnici na realizaciji (may fail with 403)
      try {
        const nastavniciNaRealizacijiResponse = await firstValueFrom(
          this.nastavnikNaRealizacijiService.getAll()
        );
        this.nastavniciNaRealizaciji = nastavniciNaRealizacijiResponse as any[];
      } catch (error) {
        console.warn('Nema dozvole za nastavnike na realizaciji:', error);
        this.nastavniciNaRealizaciji = [];
      }

      // Try to load nastavnike (may fail with 403)
      try {
        const nastavniciResponse = await firstValueFrom(
          this.nastavnikService.getAll()
        );
        this.nastavnici = nastavniciResponse as any[];
      } catch (error) {
        console.warn('Nema dozvole za nastavnike:', error);
        this.nastavnici = [];
      }

      // Load obavestenja
      const obavestenjaResponse = await firstValueFrom(
        this.obavestenjeService.getAll()
      );
      
      // Mapiranje sa nazivima predmeta i nastavnika
      this.obavestenja = this.mapObavestenjaWithDetails(obavestenjaResponse);

    } catch (error) {
      console.error('Greška pri učitavanju podataka:', error);
      this.snackBar.open('Greška pri učitavanju podataka', 'Zatvori', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }

  private mapObavestenjaWithDetails(obavestenja: Obavestenje[]): any[] {
    return obavestenja.map((obavestenje, index) => {
      // Pronađi realizaciju predmeta
      const realizacija = this.realizacijePredmeta.find(r => r.id === obavestenje.realizacijaPredmetaId);
      
      // Pronađi predmet
      const predmet = this.predmeti.find(p => p.id === realizacija?.predmetId);
      
      // Implementacija nastavnik mapping-a:
      // obavestenje.nastavnikNaRealizacijiId -> nastavnikNaRealizaciji.nastavnikId -> nastavnik.ime + nastavnik.prezime
      let nastavnikNaziv = 'Nepoznat nastavnik';
      
      if (obavestenje.nastavnikNaRealizacijiId && this.nastavniciNaRealizaciji.length > 0) {
        // Pronađi nastavnik na realizaciji
        const nastavnikNaRealizaciji = this.nastavniciNaRealizaciji.find(nnr => 
          nnr.id === obavestenje.nastavnikNaRealizacijiId
        );
        
        if (nastavnikNaRealizaciji && this.nastavnici.length > 0) {
          // Pronađi nastavnik
          const nastavnik = this.nastavnici.find(n => 
            n.id === nastavnikNaRealizaciji.nastavnikId
          );
          
          // Nastavnik objekt već sadrži ime i prezime direktno, ne treba dodatno mapiranje preko korisnikId
          if (nastavnik && nastavnik.ime && nastavnik.prezime) {
            nastavnikNaziv = `${nastavnik.ime} ${nastavnik.prezime}`;
          }
        }
      }
      
      return {
        ...obavestenje,
        predmet: predmet?.naziv || 'Nepoznat predmet',
        nastavnik: nastavnikNaziv
      };
    });
  }

  kreirajNovoObavestenje(): void {
    const dialogRef = this.dialog.open(ObavestenjeDialogComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Reload data after successful creation
        this.loadData();
      }
    });
  }
}
