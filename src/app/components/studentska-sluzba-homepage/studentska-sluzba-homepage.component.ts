import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-studentska-sluzba-homepage',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './studentska-sluzba-homepage.component.html',
  styleUrl: './studentska-sluzba-homepage.component.css'
})
export class StudentskaSluzbaHomepageComponent implements OnInit {
  
  sluzbaName = 'Studentska služba';
  
  sluzbaAnnouncements = [
    {
      title: 'Rok za prijavu ispita - januar 2025',
      content: 'Studentima se omogućava prijava ispita za januarski ispitni rok do 20. decembra.',
      date: new Date('2025-08-12'),
    },
    {
      title: 'Ažuriranje studentske dokumentacije',
      content: 'Molimo studente da ažuriraju svoje lične podatke u sistemu.',
      date: new Date('2025-08-08'),
    },
    {
      title: 'Novi raspored konsultacija',
      content: 'Objavljen je novi raspored konsultacija za zimski semestar.',
      date: new Date('2025-08-05'),
    }
  ];

  constructor() { }

  ngOnInit(): void {
    this.loadSluzbaData();
    this.loadSluzbaAnnouncements();
  }

  private loadSluzbaData(): void {
  }

  private loadSluzbaAnnouncements(): void {
  }
}
