import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { GenericTableComponent, TableColumn } from '../generic-table/generic-table.component';
import { ObavestenjeService } from '../../services/obavestenje/obavestenje.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { Obavestenje } from '../../models/obavestenje';

@Component({
  selector: 'app-obavestenje-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    GenericTableComponent
  ],
  templateUrl: './obavestenje-table.component.html',
  styleUrl: './obavestenje-table.component.css'
})
export class ObavestenjeTableComponent implements OnInit {
  data: any[] = [];
  columns: TableColumn[] = [
    { key: 'naslov', label: 'Naslov' },
    { key: 'sadrzaj', label: 'Sadržaj' },
    { key: 'vremePostavljanja', label: 'Datum' },
    { key: 'nazivPredmeta', label: 'Predmet' }
  ];
  actions: any[] = [];
  isStudent = false;

  constructor(
    private obavestenjeService: ObavestenjeService,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkIfStudent();
    this.loadData();
  }

  checkIfStudent(): void {
    const roles = this.authService.getCurrentUserRoles();
    this.isStudent = roles.includes('student');
  }

  loadData(): void {
    if (this.isStudent) {
      const userId = this.authService.getKorisnikId();
      if (userId) {
        this.obavestenjeService.getByStudentId(userId).subscribe({
          next: (obavestenja) => {
            this.data = obavestenja.map(obavestenje => ({
              ...obavestenje
            }));
          },
          error: (error) => {
          }
        });
      }
    }
  }

  onObavestenjeClick(obavestenje: any): void {
    if (obavestenje.id) {
      this.router.navigate(['/obavestenja', obavestenje.id]);
    }
  }
}
