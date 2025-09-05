import { Component, OnInit } from '@angular/core';
import { Univerzitet } from '../../models/univerzitet';
import { Nastavnik } from '../../models/nastavnik';
import { UniverzitetService } from '../../services/univerzitet/univerzitet.service';
import { NastavnikService } from '../../services/nastavnik/nastavnik.service';
import { StudijskiProgramService } from '../../services/studijskiProgram/studijski-program.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatChipsModule
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit {
  univerzitet: Univerzitet | null = null;
  univerzitetInfo: any = null;
  rektor: Nastavnik | null = null;
  studijskiProgrami: any[] = [];
  loading = false;
  error = false;
  latitude: number = 45.253186;
  longitude: number = 19.8444;

  constructor(
    private univerzitetService: UniverzitetService,
    private nastavnikService: NastavnikService,
    private studijskiProgramService: StudijskiProgramService,
    private router: Router
  ) {}

  onImageError(event: any): void {
    event.target.style.display = 'none';
    event.target.parentElement.innerHTML = `
      <div class="placeholder-image">
        <mat-icon>school</mat-icon>
        <p>Slika univerziteta</p>
      </div>
    `;
  }

  goToFakulteti() {
    this.router.navigate(['/fakulteti']);
  }

  goToStudijskiProgrami() {
    this.router.navigate(['/studijski-programi']);
  }

  goToStudijskiProgramDetails(programId: number) {
    this.router.navigate(['/studijski-programi', programId]);
  }

  ngOnInit(): void {
    this.loadUniverzitetFromBackend(1);
    this.loadStudijskiProgrami();
  }

  loadStudijskiProgrami(): void {
    this.studijskiProgramService.getAllWithDetails().subscribe({
      next: (data) => {
        this.studijskiProgrami = data;
      },
      error: (error) => {
        console.error('Greška pri učitavanju studijskih programa:', error);
      }
    });
  }

  getDisplayedPrograms(): any[] {
    return this.studijskiProgrami.slice(0, 3);
  }

  shouldShowViewAllCard(): boolean {
    return this.studijskiProgrami.length > 3;
  }

  loadUniverzitetFromBackend(id: number): void {
    this.univerzitetService.getUniverzitetInfo(id).subscribe({
      next: (infoData) => {
        this.univerzitetInfo = infoData;
        
        this.univerzitetService.getById(id).subscribe({
          next: (detailsData) => {
            this.univerzitet = detailsData;
            
            if (infoData && infoData.rektorId) {
              this.loadRektorFromBackend(infoData.rektorId);
            }
          },
          error: (error) => {
            console.error('Greška pri učitavanju detalja univerziteta:', error);
          }
        });
      },
      error: (error) => {
        console.error('Greška pri učitavanju info o univerzitetu:', error);
      }
    });
  }

  loadRektorFromBackend(rektorId: number): void {
    this.nastavnikService.getById(rektorId).subscribe({
      next: (data) => {
        this.rektor = data;
      },
      error: (error) => {
        console.error('Greška pri učitavanju rektora:', error);
      }
    });
  }
}
