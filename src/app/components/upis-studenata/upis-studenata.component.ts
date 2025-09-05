import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { StudentService, GodinaStudija, StudentNaGodini } from '../../services/student/student.service';
import { Student } from '../../models/student';
import { GenericTableComponent, TableColumn, TableAction } from '../generic-table/generic-table.component';

@Component({
  selector: 'app-upis-studenata',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatCardModule,
    FormsModule,
    GenericTableComponent
  ],
  templateUrl: './upis-studenata.component.html',
  styleUrls: ['./upis-studenata.component.css']
})
export class UpisStudenataComponent implements OnInit {
  
  studenti: Student[] = [];
  godineStudija: GodinaStudija[] = [];
  selectedStudent: Student | null = null;
  selectedGodinaStudija: GodinaStudija | null = null;
  brojIndeksa = '';
  loading = false;
  
  tableColumns: TableColumn[] = [
    { key: 'ime', label: 'Ime' },
    { key: 'prezime', label: 'Prezime' },
    { key: 'email', label: 'Email' },
    { key: 'jmbg', label: 'JMBG' }
  ];

  tableActions: TableAction[] = [
    {
      label: 'Izaberi',
      color: 'primary',
      action: (student: Student) => this.selectStudent(student)
    }
  ];
  
  constructor(
    private studentService: StudentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadNeupisaniStudenti();
    this.loadGodineStudija();
  }

  async loadNeupisaniStudenti(): Promise<void> {
    this.loading = true;
    try {
      let response = await firstValueFrom(
        this.studentService.getNeupisaniStudenti()
      );
      this.studenti = response;
    } catch (error) {
      console.error('Greška pri učitavanju neupisanih studenata:', error);
      this.snackBar.open('Greška pri učitavanju studenata', 'Zatvori', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }

  async loadGodineStudija(): Promise<void> {
    try {
      let response = await firstValueFrom(
        this.studentService.getGodineStudija()
      );
      this.godineStudija = response;
    } catch (error) {
      console.error('Greška pri učitavanju godina studija:', error);
      this.snackBar.open('Greška pri učitavanju godina studija', 'Zatvori', { duration: 3000 });
    }
  }

  selectStudent(student: Student): void {
    this.selectedStudent = student;
  }

  async upisStudent(): Promise<void> {
    if (!this.selectedStudent || !this.selectedGodinaStudija || !this.brojIndeksa.trim()) {
      this.snackBar.open('Molimo izaberite studenta, godinu studija i unesite broj indeksa', 'Zatvori', { duration: 3000 });
      return;
    }

    this.loading = true;
    try {
      let response = await firstValueFrom(
        this.studentService.upisStudentaNaGodinu(
          this.selectedStudent.id!,
          this.selectedGodinaStudija.id,
          this.brojIndeksa
        )
      );
      
      this.snackBar.open(`Student ${this.selectedStudent.ime} ${this.selectedStudent.prezime} je uspešno upisan!`, 'Zatvori', { duration: 5000 });
      
      this.studenti = this.studenti.filter(s => s.id !== this.selectedStudent!.id);
      
      this.selectedStudent = null;
      this.selectedGodinaStudija = null;
      this.brojIndeksa = '';
      
    } catch (error) {
      console.error('Greška pri upisu studenta:', error);
      this.snackBar.open('Greška pri upisu studenta', 'Zatvori', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }

  resetSelection(): void {
    this.selectedStudent = null;
    this.selectedGodinaStudija = null;
    this.brojIndeksa = '';
  }
}
