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
  latitude: number = 45.253186; // Latituda za fakultet u Novom Sadu
  longitude: number = 19.8444; // Longituda za fakultet u Novom Sadu

  constructor(private univerzitetService: UniverzitetService) {}

  ngOnInit(): void {
    // Za sada cemo koristiti dummy podatke samo zbog provere da li radi
    this.univerzitet = {
      id: 1,
      naziv: 'LMS Univerzitet'
    };
  }
}
