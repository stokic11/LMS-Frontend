import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { GenericDialogComponent } from '../generic-dialog/generic-dialog.component';
import { GenericTableComponent, TableColumn } from '../generic-table/generic-table.component';
import { DialogConfigService } from '../generic-dialog/dialog-config.service';
import { StudentService } from '../../services/student/student.service';
import { KorisnikService, KorisnikCreateRequest } from '../../services/korisnik/korisnik.service';
import { Student } from '../../models/student';

@Component({
  selector: 'app-studentska-studenti',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    GenericTableComponent
  ],
  templateUrl: './studentska-studenti.component.html',
  styleUrls: ['./studentska-studenti.component.css']
})
export class StudentskaStudentiComponent implements OnInit {
  
  loading = true;
  studenti: Student[] = [];
  
  columns: TableColumn[] = [
    { key: 'ime', label: 'Ime' },
    { key: 'prezime', label: 'Prezime' },
    { key: 'email', label: 'Email' },
    { key: 'jmbg', label: 'JMBG' },
    { key: 'korisnickoIme', label: 'Korisničko ime' }
  ];

  constructor(
    private dialog: MatDialog,
    private dialogConfigService: DialogConfigService,
    private studentService: StudentService,
    private korisnikService: KorisnikService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadStudenti();
  }

  loadStudenti(): void {
    this.loading = true;
    this.studentService.getAll().subscribe({
      next: (data: Student[]) => {
        this.studenti = data.map(student => ({
          ...student,
          ime: student.ime || 'N/A',
          prezime: student.prezime || 'N/A',
          email: student.email || 'N/A',
          jmbg: student.jmbg || 'N/A',
          korisnickoIme: student.korisnickoIme || 'N/A'
        }));
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Greška pri učitavanju studenata:', error);
        this.snackBar.open('Greška pri učitavanju studenata', 'Zatvori', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  openStudentDialog(): void {
    const config = this.dialogConfigService.getZaposleniConfig(null, true, 'student');
    
    const dialogRef = this.dialog.open(GenericDialogComponent, {
      width: '600px',
      data: config
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Podaci koji se šalju za studenta:', result);
        
        const korisnikRequest: KorisnikCreateRequest = {
          korisnickoIme: result.korisnickoIme,
          lozinka: result.lozinka,
          email: result.email,
          ime: result.ime,
          prezime: result.prezime,
          nazivUloge: 'student',
          jmbg: result.jmbg,
          ulica: result.ulica || '',
          broj: result.broj || '',
          nazivMesta: result.nazivMesta || '',
          nazivDrzave: result.nazivDrzave || ''
        };
        
        this.korisnikService.createUserWithRole(korisnikRequest).subscribe({
          next: (createdUser: any) => {
            console.log('Student uspešno kreiran:', createdUser);
            this.snackBar.open('Student je uspešno kreiran!', 'Zatvori', { duration: 3000 });
            this.loadStudenti();
          },
          error: (error: any) => {
            console.error('Greška pri kreiranju studenta:', error);
            this.snackBar.open('Greška pri kreiranju studenta', 'Zatvori', { duration: 3000 });
          }
        });
      }
    });
  }
}
