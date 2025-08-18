import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-student-homepage',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './student-homepage.component.html',
  styleUrl: './student-homepage.component.css'
})
export class StudentHomepageComponent implements OnInit {
  
  studentName = 'Marko Marković'; // Ovo ćeš dobiti iz auth servisa
  
  facultyAnnouncements = [
    {
      title: 'Početak zimskog semestra',
      content: 'Nastava zimskog semestra počinje 2. oktobra 2024. godine. Molimo sve studente da se pripreme...',
      date: new Date('2024-09-15'),
      faculty: 'Fakultet informatike'
    },
    {
      title: 'Prijava ispita - januar 2025',
      content: 'Rok za prijavu ispita za januarski ispitni rok je do 20. decembra 2024. godine...',
      date: new Date('2024-12-01'),
      faculty: 'Fakultet informatike'
    },
    {
      title: 'Obaveštenje o stipendijama',
      content: 'Otvorene su prijave za stipendije za akademsku 2024/2025 godinu. Više informacija...',
      date: new Date('2024-10-10'),
      faculty: 'Univerzitet Singidunum'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    // Ovde ćeš učitati podatke o studentu iz auth servisa
    this.loadStudentData();
    this.loadFacultyAnnouncements();
  }

  private loadStudentData(): void {
    // TODO: Implementirati poziv ka auth servisu za podatke o studentu
  }

  private loadFacultyAnnouncements(): void {
    // TODO: Implementirati poziv ka servisu za obavestenja fakulteta
  }
}
