import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { GenericDialogComponent } from '../generic-dialog/generic-dialog.component';
import { DialogConfigService } from '../generic-dialog/dialog-config.service';
import { KorisnikService } from '../../services/korisnik/korisnik.service';

@Component({
  selector: 'app-admin-zaposleni',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './admin-zaposleni.component.html',
  styleUrl: './admin-zaposleni.component.css'
})
export class AdminZaposleniComponent {

  constructor(
    private dialog: MatDialog,
    private dialogConfigService: DialogConfigService,
    private korisnikService: KorisnikService
  ) {}

  openNastavnikDialog(): void {
    const config = this.dialogConfigService.getZaposleniConfig(null, true, 'nastavnik');
    
    const dialogRef = this.dialog.open(GenericDialogComponent, {
      width: '600px',
      data: config
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        
        result.nazivUloge = 'nastavnik';
        
        console.log('Podaci koji se šalju za nastavnika:', result);
        
        this.korisnikService.create(result).subscribe({
          next: (createdUser: any) => {
            console.log('Nastavnik uspešno kreiran:', createdUser);
            alert('Nastavnik je uspešno kreiran!');
          },
          error: (error: any) => {
            console.error('Greška pri kreiranju nastavnika:', error);
            alert('Greška pri kreiranju nastavnika.');
          }
        });
      }
    });
  }

  openStudentskaSluzbaDialog(): void {
    const config = this.dialogConfigService.getZaposleniConfig(null, true, 'studentska_sluzba');
    
    const dialogRef = this.dialog.open(GenericDialogComponent, {
      width: '600px',
      data: config
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        
        result.nazivUloge = 'studentska_sluzba';
        
        this.korisnikService.create(result).subscribe({
          next: (createdUser: any) => {
            console.log('Član studentske službe uspešno kreiran:', createdUser);
            alert('Član studentske službe je uspešno kreiran!');
          },
          error: (error: any) => {
            console.error('Greška pri kreiranju člana studentske službe:', error);
            alert('Greška pri kreiranju člana studentske službe.');
          }
        });
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
        
        result.nazivUloge = 'student';
        
        console.log('Podaci koji se šalju za studenta:', result);
        
        this.korisnikService.create(result).subscribe({
          next: (createdUser: any) => {
            console.log('Student uspešno kreiran:', createdUser);
            alert('Student je uspešno kreiran!');
          },
          error: (error: any) => {
            console.error('Greška pri kreiranju studenta:', error);
            alert('Greška pri kreiranju studenta.');
          }
        });
      }
    });
  }
}
