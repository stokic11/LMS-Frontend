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

  ngOnInit(): void {
    this.univerzitet = {
      id: 1,
      naziv: 'Univerzitet u Novom Sadu',
      datumOsnivanja: new Date('1960-06-28'),
      adresa: {
        id: 1,
        ulica: 'Dr Miće Vulkanizera',
        broj: '1',
        mesto: {
          id: 1,
          naziv: 'Novi Sad',
          drzava: {
            id: 1,
            naziv: 'Srbija'
          }
        }
      },
      rektor: {
        id: 1,
        korisnickoIme: 'rektor.uns',
        lozinka: 'password123',
        email: 'rektor@uns.ac.rs',
        ime: 'Miroslav Mićanović',
        biografija: 'Renomirani akademik sa dugogodišnjim iskustvom u oblasti elektrotehnike i računarskih nauka.',
        jmbg: '1503965800001',
        zvanje: 'Redovni profesor',
        uloga: {
          id: 1,
          naziv: 'Rektor'
        }
      }
    };
  }
}
