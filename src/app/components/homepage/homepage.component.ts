import { Component, OnInit } from '@angular/core';
import { Univerzitet } from '../../models/univerzitet';
import { UniverzitetService } from '../../services/univerzitet/univerzitet.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

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
  latitude: number = 45.253186;
  longitude: number = 19.8444;

  constructor(private univerzitetService: UniverzitetService) {}

  onImageError(event: any): void {
    // Fallback na placeholder ako slika ne može da se učita
    event.target.style.display = 'none';
    event.target.parentElement.innerHTML = `
      <div class="placeholder-image">
        <mat-icon>school</mat-icon>
        <p>Slika univerziteta</p>
      </div>
    `;
  }

  goToFakulteti() {
    window.location.href = '/fakulteti';
  }

  goToStudijskiProgrami() {
    window.location.href = '/studijski-programi';
  }

  ngOnInit(): void {
    this.univerzitet = {
      id: 1,
      naziv: 'Univerzitet Singidunum',
      datumOsnivanja: new Date('2005-01-01'),
      adresa: {
        id: 1,
        ulica: 'Danijelova',
        broj: '32',
        mesto: {
          id: 1,
          naziv: 'Beograd',
          drzava: {
            id: 1,
            naziv: 'Srbija'
          }
        }
      },
      rektorId: 1,
      fakultetiIds: [1, 2, 3]
    };
  }
}
