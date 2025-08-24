import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin-homepage',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './admin-homepage.component.html',
  styleUrl: './admin-homepage.component.css'
})
export class AdminHomepageComponent implements OnInit {
  
  adminName = 'Administrator';
  
  adminAnnouncements = [
    {
      title: 'Ažuriranje sistema',
      content: 'Sistem će biti nedostupan za održavanje u nedelju od 02:00 do 04:00.',
      date: new Date('2025-08-15'),
    },
    {
      title: 'Nova sigurnosna politika',
      content: 'Implementirane su nove sigurnosne mere za zaštitu korisničkih podataka.',
      date: new Date('2025-08-10'),
    },
    {
      title: 'Backup završen uspešno',
      content: 'Redovni backup baze podataka je završen bez grešaka.',
      date: new Date('2025-08-05'),
    }
  ];

  constructor() { }

  ngOnInit(): void {
    this.loadAdminData();
    this.loadAdminAnnouncements();
  }

  private loadAdminData(): void {
  }

  private loadAdminAnnouncements(): void {
  }
}
