import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GenericTableComponent, TableColumn } from '../generic-table/generic-table.component';
import { NastavnikService } from '../../services/nastavnik/nastavnik.service';
import { PohadjanjePredmetaService } from '../../services/pohadjanjePredmeta/pohadjanje-predmeta.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { Predmet } from '../../models/predmet';
import { Student } from '../../models/student';

@Component({
  selector: 'app-nastavnik-studenti',
  standalone: true,
  imports: [CommonModule, GenericTableComponent, MatButtonModule, MatIconModule, 
           FormsModule, MatInputModule, MatFormFieldModule],
  templateUrl: './nastavnik-studenti.component.html',
  styleUrl: './nastavnik-studenti.component.css'
})
export class NastavnikStudentiComponent implements OnInit {
  predmeti: Predmet[] = [];
  studenti: Student[] = [];
  filteredStudenti: Student[] = [];
  selectedPredmet: Predmet | null = null;
  showStudenti = false;

  searchFilters = {
    ime: '',
    prezime: '',
    brojIndeksa: '',
    godinaUpisa: '',
    prosecnaOcena: '',
    konacnaOcena: ''
  };

  predmetiColumns: TableColumn[] = [
    { key: 'naziv', label: 'Naziv predmeta' },
    { key: 'espb', label: 'ESPB' },
    { key: 'brojSemestra', label: 'Semestar' }
  ];

  studentiColumns: TableColumn[] = [
    { key: 'ime', label: 'Ime' },
    { key: 'prezime', label: 'Prezime' },
    { key: 'brojIndeksa', label: 'Broj indeksa' },
    { key: 'godinaUpisa', label: 'Godina upisa' },
    { key: 'prosecnaOcena', label: 'Prosečna ocena' },
    { key: 'konacnaOcena', label: 'Ocena' }
  ];

  constructor(
    private nastavnikService: NastavnikService,
    private pohadjanjePredmetaService: PohadjanjePredmetaService,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadNastavnikPredmeti();
  }

  loadNastavnikPredmeti(): void {
    let userId = this.authService.getKorisnikId();
    if (userId) {
      this.nastavnikService.getPredmeti(userId).subscribe({
        next: (predmeti: any) => {
          this.predmeti = predmeti.map((row: any[]): Predmet => ({
            id: row[0],
            naziv: row[1],
            espb: row[2],
            obavezan: row[3],
            obavezanText: row[3] ? 'Obavezan' : 'Izborni',
            brojSemestra: row[4],
            brojPredavanja: row[5],
            brojVezbi: row[6],
            drugiObliciNastave: 0,
            istrazivackiRad: 0,
            ostaliCasovi: 0,
            silabus: [],
            godinaStudijaId: 0
          }));
        },
        error: (error: any) => console.error('Error loading predmeti:', error)
      });
    }
  }

  onPredmetClick(predmet: Predmet): void {
    this.selectedPredmet = predmet;
    this.showStudenti = true;
    this.loadStudentiByPredmet(predmet.id!);
  }

  loadStudentiByPredmet(predmetId: number): void {
    this.pohadjanjePredmetaService.getStudentsByPredmetId(predmetId).subscribe({
      next: (data: any[]) => {
        this.studenti = data.map((row: any[]): Student => ({
          id: row[0],
          ime: row[1],
          prezime: row[2],
          brojIndeksa: row[3],
          godinaUpisa: new Date(row[4]).getFullYear(),
          prosecnaOcena: row[5] === 0 ? 'Nema ocena' : parseFloat(row[5]).toFixed(2),
          konacnaOcena: row[6] || 'Nije ocenjen',
          jmbg: '',
          adresa: { 
            id: 0, 
            ulica: '', 
            broj: '', 
            mesto: { 
              id: 0, 
              naziv: '', 
              postanskiBroj: '', 
              drzava: { id: 0, naziv: '' }
            } 
          },
          korisnickoIme: '',
          email: ''
        }));
        this.filteredStudenti = [...this.studenti];
      },
      error: (error: any) => console.error('Error loading studenti:', error)
    });
  }

  applyFilters(): void {
    this.filteredStudenti = this.studenti.filter(student => {
      return this.matchesFilter(student.ime || '', this.searchFilters.ime) &&
             this.matchesFilter(student.prezime || '', this.searchFilters.prezime) &&
             this.matchesFilter(student.brojIndeksa || '', this.searchFilters.brojIndeksa) &&
             this.matchesFilter((student.godinaUpisa || 0).toString(), this.searchFilters.godinaUpisa) &&
             this.matchesFilter(student.prosecnaOcena || '', this.searchFilters.prosecnaOcena) &&
             this.matchesFilter((student.konacnaOcena || '').toString(), this.searchFilters.konacnaOcena);
    });
  }

  private matchesFilter(value: string, filter: string): boolean {
    if (!filter) return true;
    return value.toLowerCase().includes(filter.toLowerCase());
  }

  clearFilters(): void {
    this.searchFilters = {
      ime: '',
      prezime: '',
      brojIndeksa: '',
      godinaUpisa: '',
      prosecnaOcena: '',
      konacnaOcena: ''
    };
    this.filteredStudenti = [...this.studenti];
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    let charCode = event.charCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  allowNumbersAndDecimal(event: KeyboardEvent): void {
    let charCode = event.charCode;
    let inputValue = (event.target as HTMLInputElement).value;
    if ((charCode < 48 || charCode > 57) && charCode !== 46) {
      event.preventDefault();
    }
    if (charCode === 46 && inputValue.includes('.')) {
      event.preventDefault();
    }
  }

  goBack(): void {
    this.showStudenti = false;
    this.selectedPredmet = null;
    this.studenti = [];
    this.filteredStudenti = [];
    this.clearFilters();
  }

  onStudentClick(student: Student): void {
    if (student && student.id) {
      this.router.navigate(['/studenti', student.id]);
    } else {
      console.error('Student nema valid id:', student);
    }
  }
}
