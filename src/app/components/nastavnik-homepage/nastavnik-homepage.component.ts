import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nastavnik-homepage',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, RouterModule],
  templateUrl: './nastavnik-homepage.component.html',
  styleUrl: './nastavnik-homepage.component.css'
})
export class NastavnikHomepageComponent implements OnInit {
  nastavnikName = 'Petar Petrović';
  facultyAnnouncements = [
    {
      title: 'Promena termina predavanja',
      content: 'Predavanje iz predmeta Matematika pomereno je na petak u 10h.',
      date: new Date('2025-08-10'),
      faculty: 'Fakultet informatike'
    },
    {
      title: 'Novi materijali dostupni',
      content: 'Dodati su novi materijali za predmet Programiranje 2.',
      date: new Date('2025-08-15'),
      faculty: 'Fakultet informatike'
    }
  ];
  facultyChanges = [
    'Promenjen pravilnik o ocenjivanju',
    'Dodata nova laboratorija',
    'Ažuriran raspored ispita za septembar'
  ];

  ngOnInit(): void {
    this.loadNastavnikData();
    this.loadFacultyAnnouncements();
    this.loadFacultyChanges();
  }

  private loadNastavnikData(): void {
  }

  private loadFacultyAnnouncements(): void {
  }

  private loadFacultyChanges(): void {
  }
}
