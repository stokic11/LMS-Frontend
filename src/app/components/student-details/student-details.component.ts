import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { GenericDetailsComponent, InfoSection, TableSection } from '../generic-details/generic-details.component';
import { StudentService } from '../../services/student/student.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-student-details',
  standalone: true,
  imports: [CommonModule, GenericDetailsComponent],
  templateUrl: './student-details.component.html',
  styleUrl: './student-details.component.css'
})
export class StudentDetailsComponent implements OnInit {
  loading = false;
  error = false;
  title = '';
  studentId: number = 0;

  infoSections: InfoSection[] = [];
  tableSections: TableSection[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentService,
    private location: Location
  ) {}

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.studentId = parseInt(id);
      this.loadStudentData();
    } else {
      this.error = true;
      this.title = 'Nije pronadjen ID studenta';
    }
  }

  loadStudentData(): void {
    this.loading = true;
    this.error = false;
    
    forkJoin({
      osnovniPodaci: this.studentService.getOsnovniPodaci(this.studentId),
      akademskiPodaci: this.studentService.getAkademskiPodaci(this.studentId),
      polozeniIspiti: this.studentService.getPolozeniIspiti(this.studentId),
      neuspesnaPolaganja: this.studentService.getNeuspesnaPolaganja(this.studentId),
      upisi: this.studentService.getUpisi(this.studentId)
    }).subscribe({
      next: (data) => {
        this.processStudentData(data);
        this.loading = false;
      },
      error: (error) => {
        console.error('Greska pri ucitavanju podataka o studentu:', error);
        this.error = true;
        this.loading = false;
        this.title = `Greska pri ucitavanju studenta (ID: ${this.studentId})`;
      }
    });
  }

  private processStudentData(data: any): void {
    if (data.osnovniPodaci && data.osnovniPodaci.length > 0) {
      let student = data.osnovniPodaci[0];
      this.title = `Detalji studenta`;
    } else {
      this.title = `Detalji studenta`;
    }
    
    this.infoSections = [];
    if (data.osnovniPodaci && data.osnovniPodaci.length > 0) {
      let student = data.osnovniPodaci[0];
      this.infoSections.push({
        title: 'Osnovni podaci',
        icon: 'person',
        items: [
          { label: 'Ime', value: student[0] || 'N/D' },
          { label: 'Prezime', value: student[1] || 'N/D' },
          { label: 'JMBG', value: student[2] || 'N/D' },
          { label: 'Email', value: student[3] || 'N/D', type: 'email' },
          { label: 'Adresa', value: student[4] || 'N/D' }
        ]
      });
    }

    if (data.akademskiPodaci && data.akademskiPodaci.length > 0) {
      let akademski = data.akademskiPodaci[0];
      this.infoSections.push({
        title: 'Akademski podaci',
        icon: 'school',
        items: [
          { label: 'Prosecna ocena', value: akademski[0] ? akademski[0].toString() : 'Nema ocena' },
          { label: 'Ukupno ECTS', value: akademski[1] ? akademski[1].toString() : '0' }
        ]
      });
    }

    this.tableSections = [];

    if (data.polozeniIspiti && data.polozeniIspiti.length > 0) {
      this.tableSections.push({
        title: 'Polozeni ispiti',
        icon: 'check_circle',
        data: data.polozeniIspiti.map((row: any[]) => ({
          predmet: row[0],
          datumPolaganja: this.formatDateOnly(row[4]),
          ects: row[1],
          bodovi: row[2] || 'N/D',
          ocena: row[3]
        })),
        displayedColumns: ['predmet', 'datumPolaganja', 'ects', 'bodovi', 'ocena'],
        columnLabels: {
          predmet: 'Predmet',
          datumPolaganja: 'Datum polaganja',
          ects: 'ECTS',
          bodovi: 'Bodovi',
          ocena: 'Ocena'
        }
      });
    }

    if (data.neuspesnaPolaganja && data.neuspesnaPolaganja.length > 0) {
      this.tableSections.push({
        title: 'Neuspesna polaganja',
        icon: 'cancel',
        data: data.neuspesnaPolaganja.map((row: any[]) => ({
          predmet: row[0],
          datumPolaganja: this.formatDateOnly(row[4]),
          ects: row[1],
          bodovi: row[2] || 'N/D',
          ocena: row[3]
        })),
        displayedColumns: ['predmet', 'datumPolaganja', 'ects', 'bodovi', 'ocena'],
        columnLabels: {
          predmet: 'Predmet',
          datumPolaganja: 'Datum polaganja',
          ects: 'ECTS',
          bodovi: 'Bodovi',
          ocena: 'Ocena'
        }
      });
    }

    if (data.upisi && data.upisi.length > 0) {
      this.tableSections.push({
        title: 'Upisi',
        icon: 'school',
        data: data.upisi.map((row: any[]) => ({
          datumUpisa: this.formatDateOnly(row[0]),
          brojIndeksa: row[1],
          studijskiProgram: row[4]
        })),
        displayedColumns: ['datumUpisa', 'brojIndeksa', 'studijskiProgram'],
        columnLabels: {
          datumUpisa: 'Datum upisa',
          brojIndeksa: 'Broj indeksa',
          studijskiProgram: 'Studijski program'
        }
      });
    }
  }

  private formatDateOnly(dateTimeString: string): string {
    if (!dateTimeString) return 'N/D';
    
    try {
      let date = new Date(dateTimeString);
      
      if (isNaN(date.getTime())) {
        return dateTimeString; 
      }
      
      let day = date.getDate().toString().padStart(2, '0');
      let month = (date.getMonth() + 1).toString().padStart(2, '0');
      let year = date.getFullYear();
      
      return `${day}/${month}/${year}`;
    } catch (error) {
      return dateTimeString;
    }
  }

  goBack(): void {
    this.location.back();
  }
}
