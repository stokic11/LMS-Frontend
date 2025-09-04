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
import { GenericDialogComponent } from '../generic-dialog/generic-dialog.component';
import { Obavestenje } from '../../models/obavestenje';
import { ObavestenjeService } from '../../services/obavestenje/obavestenje.service';
import { RealizacijaPredmetaService } from '../../services/realizacijaPredmeta/realizacija-predmeta.service';
import { PredmetService } from '../../services/predmet/predmet.service';
import { NastavnikNaRealizacijiService } from '../../services/nastavnikNaRealizaciji/nastavnik-na-realizaciji.service';
import { NastavnikService } from '../../services/nastavnik/nastavnik.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';

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
    { key: 'naslov', label: 'Naslov', sortable: true },
    { key: 'sadrzaj', label: 'Sadržaj', sortable: false },
    { key: 'predmet', label: 'Predmet', sortable: true },
    { key: 'nastavnik', label: 'Nastavnik', sortable: true },
    { key: 'vremePostavljanja', label: 'Vreme postavljanja', sortable: true }
  ];

  obavestenjaActions = [
    {
      label: 'Izmeni',
      icon: 'edit',
      color: 'accent',
      action: (obavestenje: any) => this.izmeniObavestenje(obavestenje)
    },
    {
      label: 'Obriši',
      icon: 'delete',
      color: 'warn',
      action: (obavestenje: any) => this.obrisiObavestenje(obavestenje)
    }
  ];

  constructor(
    private obavestenjeService: ObavestenjeService,
    private realizacijaPredmetaService: RealizacijaPredmetaService,
    private predmetService: PredmetService,
    private nastavnikNaRealizacijiService: NastavnikNaRealizacijiService,
    private nastavnikService: NastavnikService,
    private authService: AuthenticationService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    this.loading = true;
    try {
      const predmetiResponse = await firstValueFrom(
        this.predmetService.getAll()
      );
      this.predmeti = predmetiResponse;

      const realizacijeResponse = await firstValueFrom(
        this.realizacijaPredmetaService.getAll()
      );
      this.realizacijePredmeta = realizacijeResponse as any[];

      try {
        const nastavniciNaRealizacijiResponse = await firstValueFrom(
          this.nastavnikNaRealizacijiService.getAll()
        );
        this.nastavniciNaRealizaciji = nastavniciNaRealizacijiResponse as any[];
      } catch (error) {
        this.nastavniciNaRealizaciji = [];
      }

      try {
        const nastavniciResponse = await firstValueFrom(
          this.nastavnikService.getAll()
        );
        this.nastavnici = nastavniciResponse as any[];
      } catch (error) {
        this.nastavnici = [];
      }

      const obavestenjaResponse = await firstValueFrom(
        this.obavestenjeService.getAllByRole()
      );
      
      // Backend response već sadrži potrebna polja
      this.obavestenja = obavestenjaResponse.map((obavestenje: any) => ({
        ...obavestenje,
        predmet: obavestenje.nazivPredmeta || 'Nepoznat predmet',
        nastavnik: (obavestenje.nastavnikIme && obavestenje.nastavnikPrezime) 
          ? `${obavestenje.nastavnikIme} ${obavestenje.nastavnikPrezime}`
          : this.getNastavnikName(obavestenje.nastavnikNaRealizacijiId)
      }));

    } catch (error) {
      this.snackBar.open('Greška pri učitavanju podataka', 'Zatvori', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }

  private getNastavnikName(nastavnikNaRealizacijiId: number): string {
    if (!nastavnikNaRealizacijiId || this.nastavniciNaRealizaciji.length === 0) {
      return 'Nepoznat nastavnik';
    }
    
    const nastavnikNaRealizaciji = this.nastavniciNaRealizaciji.find(nnr => 
      nnr.id === nastavnikNaRealizacijiId
    );
    
    if (nastavnikNaRealizaciji && this.nastavnici.length > 0) {
      const nastavnik = this.nastavnici.find(n => 
        n.id === nastavnikNaRealizaciji.nastavnikId
      );
      
      if (nastavnik && nastavnik.ime && nastavnik.prezime) {
        return `${nastavnik.ime} ${nastavnik.prezime}`;
      }
    }
    
    return 'Nepoznat nastavnik';
  }

  private mapObavestenjaWithDetails(obavestenja: any[]): any[] {
    return obavestenja.map((obavestenje, index) => {
      const realizacija = this.realizacijePredmeta.find(r => r.id === obavestenje.realizacijaPredmetaId);
      
      const predmet = this.predmeti.find(p => p.id === realizacija?.predmetId);
      
      let nastavnikNaziv = 'Nepoznat nastavnik';
      
      if (obavestenje.nastavnikNaRealizacijiId && this.nastavniciNaRealizaciji.length > 0) {
        const nastavnikNaRealizaciji = this.nastavniciNaRealizaciji.find(nnr => 
          nnr.id === obavestenje.nastavnikNaRealizacijiId
        );
        
        if (nastavnikNaRealizaciji && this.nastavnici.length > 0) {
          const nastavnik = this.nastavnici.find(n => 
            n.id === nastavnikNaRealizaciji.nastavnikId
          );
          
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

  async kreirajNovoObavestenje(): Promise<void> {
    const roles = this.authService.getCurrentUserRoles();
    const isNastavnik = roles.includes('nastavnik') && !roles.includes('studentska_sluzba');
    
    if (isNastavnik) {
      await this.kreirajObavestenjeZaNastavnika();
    } else {
      await this.kreirajObavestenjeZaAdmina();
    }
  }

  private async kreirajObavestenjeZaNastavnika(): Promise<void> {
    const currentUserId = this.authService.getKorisnikId();
    let currentNastavnikId: number | null = null;
    let filteredPredmeti: any[] = [];
    
    if (currentUserId) {
      try {
        const currentNastavnik = this.nastavnici.find(n => n.id === currentUserId);
        if (currentNastavnik) {
          currentNastavnikId = currentNastavnik.id;
          
          const nastavnikRealizacije = this.nastavniciNaRealizaciji.filter(nnr => 
            nnr.nastavnikId === currentNastavnikId
          );
          
          const predmetRealizacijaMap = new Map<number, any>();
          
          nastavnikRealizacije.forEach(nnr => {
            const realizacija = this.realizacijePredmeta.find(r => r.id === nnr.realizacijaPredmetaId);
            const predmet = this.predmeti.find(p => p.id === realizacija?.predmetId);
            
            if (predmet && realizacija) {
              const predmetId = predmet.id;
              
              if (!predmetRealizacijaMap.has(predmetId) || 
                  realizacija.id > predmetRealizacijaMap.get(predmetId).realizacijaId) {
                
                predmetRealizacijaMap.set(predmetId, {
                  value: nnr.id,
                  label: predmet.naziv,
                  nastavnikNaRealizacijiId: nnr.id,
                  predmetId: predmet.id,
                  realizacijaId: realizacija.id,
                  realizacijaPredmetaId: nnr.realizacijaPredmetaId
                });
              }
            }
          });
          
          filteredPredmeti = Array.from(predmetRealizacijaMap.values())
            .sort((a, b) => a.label.localeCompare(b.label));
        }
      } catch (error) {
        this.snackBar.open('Greška pri učitavanju podataka za nastavnika', 'Zatvori', { duration: 3000 });
        return;
      }
    }

    const dialogRef = this.dialog.open(GenericDialogComponent, {
      width: '500px',
      disableClose: true,
      data: {
        title: 'Dodaj novo obaveštenje',
        fields: [
          {
            name: 'predmetId',
            label: 'Predmet',
            type: 'select' as const,
            required: true,
            options: filteredPredmeti
          },
          {
            name: 'naslov',
            label: 'Naslov',
            type: 'text' as const,
            required: true,
            placeholder: 'Unesite naslov obaveštenja'
          },
          {
            name: 'sadrzaj',
            label: 'Sadržaj',
            type: 'textarea' as const,
            required: true,
            placeholder: 'Unesite sadržaj obaveštenja',
            rows: 4
          }
        ],
        isNew: true,
        customSave: async (formValue: any, isNew: boolean) => {
          try {
            const selectedPredmet = filteredPredmeti.find(p => p.value === formValue.predmetId);
            if (!selectedPredmet) {
              throw new Error('Nije pronađen odabrani predmet');
            }
            
            const obavestenjeData = {
              naslov: formValue.naslov,
              sadrzaj: formValue.sadrzaj,
              vremePostavljanja: new Date(),
              nastavnikNaRealizacijiId: selectedPredmet.nastavnikNaRealizacijiId,
              realizacijaPredmetaId: selectedPredmet.realizacijaPredmetaId
            };

            const createdObavestenje = await firstValueFrom(
              this.obavestenjeService.create(obavestenjeData as Obavestenje)
            );
            
            this.snackBar.open('Obaveštenje je uspešno kreirano!', 'Zatvori', { duration: 3000 });
            return createdObavestenje;
            
          } catch (error) {
            this.snackBar.open('Greška pri kreiranju obaveštenja', 'Zatvori', { duration: 3000 });
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

  private async kreirajObavestenjeZaAdmina(): Promise<void> {
    const nastavnikDialogRef = this.dialog.open(GenericDialogComponent, {
      width: '400px',
      disableClose: true,
      data: {
        title: 'Izaberite nastavnika',
        fields: [
          {
            name: 'nastavnikId',
            label: 'Nastavnik',
            type: 'select' as const,
            required: true,
            options: this.nastavnici.map(n => ({
              value: n.id,
              label: `${n.ime} ${n.prezime}`
            }))
          }
        ],
        isNew: true
      }
    });

    nastavnikDialogRef.afterClosed().subscribe(async (nastavnikResult) => {
      if (nastavnikResult && nastavnikResult.nastavnikId) {
        await this.kreirajObavestenjeZaOdabranogNastavnika(nastavnikResult.nastavnikId);
      }
    });
  }

  private async kreirajObavestenjeZaOdabranogNastavnika(nastavnikId: number): Promise<void> {
    const nastavnikRealizacije = this.nastavniciNaRealizaciji.filter(nnr => 
      nnr.nastavnikId === nastavnikId
    );
    
    const predmetRealizacijaMap = new Map<number, any>();
    
    nastavnikRealizacije.forEach(nnr => {
      const realizacija = this.realizacijePredmeta.find(r => r.id === nnr.realizacijaPredmetaId);
      const predmet = this.predmeti.find(p => p.id === realizacija?.predmetId);
      
      if (predmet && realizacija) {
        const predmetId = predmet.id;
        
        if (!predmetRealizacijaMap.has(predmetId) || 
            realizacija.id > predmetRealizacijaMap.get(predmetId).realizacijaId) {
          
          predmetRealizacijaMap.set(predmetId, {
            value: nnr.id,
            label: predmet.naziv,
            nastavnikNaRealizacijiId: nnr.id,
            predmetId: predmet.id,
            realizacijaId: realizacija.id,
            realizacijaPredmetaId: nnr.realizacijaPredmetaId
          });
        }
      }
    });
    
    const filteredPredmeti = Array.from(predmetRealizacijaMap.values())
      .sort((a, b) => a.label.localeCompare(b.label));

    const dialogRef = this.dialog.open(GenericDialogComponent, {
      width: '500px',
      disableClose: true,
      data: {
        title: 'Dodaj novo obaveštenje',
        fields: [
          {
            name: 'predmetId',
            label: 'Predmet',
            type: 'select' as const,
            required: true,
            options: filteredPredmeti
          },
          {
            name: 'naslov',
            label: 'Naslov',
            type: 'text' as const,
            required: true,
            placeholder: 'Unesite naslov obaveštenja'
          },
          {
            name: 'sadrzaj',
            label: 'Sadržaj',
            type: 'textarea' as const,
            required: true,
            placeholder: 'Unesite sadržaj obaveštenja',
            rows: 4
          }
        ],
        isNew: true,
        customSave: async (formValue: any, isNew: boolean) => {
          try {
            const selectedPredmet = filteredPredmeti.find(p => p.value === formValue.predmetId);
            if (!selectedPredmet) {
              throw new Error('Nije pronađen odabrani predmet');
            }
            
            const obavestenjeData = {
              naslov: formValue.naslov,
              sadrzaj: formValue.sadrzaj,
              vremePostavljanja: new Date(),
              nastavnikNaRealizacijiId: selectedPredmet.nastavnikNaRealizacijiId,
              realizacijaPredmetaId: selectedPredmet.realizacijaPredmetaId
            };

            const createdObavestenje = await firstValueFrom(
              this.obavestenjeService.create(obavestenjeData as Obavestenje)
            );
            
            this.snackBar.open('Obaveštenje je uspešno kreirano!', 'Zatvori', { duration: 3000 });
            return createdObavestenje;
            
          } catch (error) {
            this.snackBar.open('Greška pri kreiranju obaveštenja', 'Zatvori', { duration: 3000 });
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

  async izmeniObavestenje(obavestenje: any): Promise<void> {
    const nastavnikNaRealizaciji = this.nastavniciNaRealizaciji.find(nnr => 
      nnr.id === obavestenje.nastavnikNaRealizacijiId
    );
    
    if (!nastavnikNaRealizaciji) {
      this.snackBar.open('Greška pri učitavanju podataka o obaveštenju', 'Zatvori', { duration: 3000 });
      return;
    }

    const realizacija = this.realizacijePredmeta.find(r => r.id === nastavnikNaRealizaciji.realizacijaPredmetaId);
    const nastavnik = this.nastavnici.find(n => n.id === nastavnikNaRealizaciji.nastavnikId);
    const predmet = this.predmeti.find(p => p.id === realizacija?.predmetId);

    const nastavnikRealizacije = this.nastavniciNaRealizaciji.filter(nnr => 
      nnr.nastavnikId === nastavnikNaRealizaciji.nastavnikId
    );
    
    const predmetRealizacijaMap = new Map<number, any>();
    
    nastavnikRealizacije.forEach(nnr => {
      const rel = this.realizacijePredmeta.find(r => r.id === nnr.realizacijaPredmetaId);
      const pred = this.predmeti.find(p => p.id === rel?.predmetId);
      
      if (pred && rel) {
        const predmetId = pred.id;
        
        if (!predmetRealizacijaMap.has(predmetId) || 
            rel.id > predmetRealizacijaMap.get(predmetId).realizacijaId) {
          
          predmetRealizacijaMap.set(predmetId, {
            value: nnr.id,
            label: pred.naziv,
            nastavnikNaRealizacijiId: nnr.id,
            predmetId: pred.id,
            realizacijaId: rel.id,
            realizacijaPredmetaId: nnr.realizacijaPredmetaId
          });
        }
      }
    });
    
    const filteredPredmeti = Array.from(predmetRealizacijaMap.values())
      .sort((a, b) => a.label.localeCompare(b.label));

    const dialogRef = this.dialog.open(GenericDialogComponent, {
      width: '500px',
      disableClose: true,
      data: {
        title: 'Izmeni obaveštenje',
        fields: [
          {
            name: 'predmetId',
            label: 'Predmet',
            type: 'select' as const,
            required: true,
            options: filteredPredmeti
          },
          {
            name: 'naslov',
            label: 'Naslov',
            type: 'text' as const,
            required: true,
            placeholder: 'Unesite naslov obaveštenja'
          },
          {
            name: 'sadrzaj',
            label: 'Sadržaj',
            type: 'textarea' as const,
            required: true,
            placeholder: 'Unesite sadržaj obaveštenja',
            rows: 4
          }
        ],
        data: {
          predmetId: nastavnikNaRealizaciji.id,
          naslov: obavestenje.naslov,
          sadrzaj: obavestenje.sadrzaj
        },
        isNew: false,
        customSave: async (formValue: any, isNew: boolean) => {
          try {
            const selectedPredmet = filteredPredmeti.find(p => p.value === formValue.predmetId);
            if (!selectedPredmet) {
              throw new Error('Nije pronađen odabrani predmet');
            }
            
            const obavestenjeData = {
              ...obavestenje,
              naslov: formValue.naslov,
              sadrzaj: formValue.sadrzaj,
              nastavnikNaRealizacijiId: selectedPredmet.nastavnikNaRealizacijiId,
              realizacijaPredmetaId: selectedPredmet.realizacijaPredmetaId
            };

            const updatedObavestenje = await firstValueFrom(
              this.obavestenjeService.put(obavestenje.id, obavestenjeData as Obavestenje)
            );
            
            this.snackBar.open('Obaveštenje je uspešno izmenjeno!', 'Zatvori', { duration: 3000 });
            return updatedObavestenje;
            
          } catch (error) {
            this.snackBar.open('Greška pri izmeni obaveštenja', 'Zatvori', { duration: 3000 });
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

  async obrisiObavestenje(obavestenje: any): Promise<void> {
    const dialogRef = this.dialog.open(GenericDialogComponent, {
      width: '400px',
      disableClose: true,
      data: {
        title: 'Potvrdi brisanje',
        subtitle: `Da li ste sigurni da želite da obrišete obaveštenje "${obavestenje.naslov}"?`,
        fields: [
          {
            name: 'confirmation',
            label: 'Potvrdite brisanje',
            type: 'dynamic-text' as const,
            dynamicText: () => 'Ova akcija se ne može poništiti.'
          }
        ],
        isNew: false,
        customSave: async (formValue: any, isNew: boolean) => {
          try {
            await firstValueFrom(this.obavestenjeService.delete(obavestenje.id));
            this.snackBar.open('Obaveštenje je uspešno obrisano!', 'Zatvori', { duration: 3000 });
            return true;
          } catch (error) {
            this.snackBar.open('Greška pri brisanju obaveštenja', 'Zatvori', { duration: 3000 });
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
}
