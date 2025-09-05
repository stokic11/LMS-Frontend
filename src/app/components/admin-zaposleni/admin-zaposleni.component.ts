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
    let config = this.dialogConfigService.getZaposleniConfig(null, true, 'nastavnik');
    
    let dialogRef = this.dialog.open(GenericDialogComponent, {
      width: '600px',
      data: config
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        result.nazivUloge = 'nastavnik';
        
        this.korisnikService.create(result).subscribe({
          next: (createdUser: any) => {
            alert('Nastavnik je uspešno kreiran!');
          },
          error: (error: any) => {
            alert('Greška pri kreiranju nastavnika.');
          }
        });
      }
    });
  }

  openStudentskaSluzbaDialog(): void {
    let config = this.dialogConfigService.getZaposleniConfig(null, true, 'studentska_sluzba');
    
    let dialogRef = this.dialog.open(GenericDialogComponent, {
      width: '600px',
      data: config
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        
        result.nazivUloge = 'studentska_sluzba';
        
        this.korisnikService.create(result).subscribe({
          next: (createdUser: any) => {
            alert('Član studentske službe je uspešno kreiran!');
          },
          error: (error: any) => {
            alert('Greška pri kreiranju člana studentske službe.');
          }
        });
      }
    });
  }

  openAdminDialog(): void {
    let config = this.dialogConfigService.getZaposleniConfig(null, true, 'admin');
    
    let dialogRef = this.dialog.open(GenericDialogComponent, {
      width: '600px',
      data: config
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        
        result.nazivUloge = 'admin';
        
        this.korisnikService.create(result).subscribe({
          next: (createdUser: any) => {
            alert('Administrator je uspešno kreiran!');
          },
          error: (error: any) => {
            alert('Greška pri kreiranju administratora.');
          }
        });
      }
    });
  }
}
