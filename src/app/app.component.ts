import { Component, ViewChild } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from './services/authentication/authentication.service';
import { KorisnikService } from './services/korisnik/korisnik.service';
import { GenericDialogComponent } from './components/generic-dialog/generic-dialog.component';
import { DialogConfigService } from './components/generic-dialog/dialog-config.service';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    CommonModule, 
    RouterModule,
    MatToolbarModule, 
    MatButtonModule,
    MatSidenavModule,
    MatListModule, 
    MatIconModule,
    MatDialogModule,
    GenericDialogComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'University LMS';
  isAuthenticated$: Observable<boolean>;
  isKorisnik$: Observable<boolean>;
  isStudent$: Observable<boolean>;
  isNastavnik$: Observable<boolean>;
  isStudentskaSluzba$: Observable<boolean>;
  isAdmin$: Observable<boolean>;

  @ViewChild('drawer') drawer!: MatSidenav;
  isDrawerOpened = true;

  constructor(
    private router: Router, 
    private authService: AuthenticationService,
    private korisnikService: KorisnikService,
    private dialog: MatDialog,
    private dialogConfigService: DialogConfigService
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated;
    
    this.isKorisnik$ = combineLatest([this.authService.isAuthenticated, this.authService.uloge$]).pipe(
      map(([isAuth, uloge]) => isAuth && uloge.includes('korisnik'))
    );
    
    this.isStudent$ = combineLatest([this.authService.isAuthenticated, this.authService.uloge$]).pipe(
      map(([isAuth, uloge]) => isAuth && uloge.includes('student'))
    );
    
    this.isNastavnik$ = combineLatest([this.authService.isAuthenticated, this.authService.uloge$]).pipe(
      map(([isAuth, uloge]) => isAuth && uloge.includes('nastavnik'))
    );
    
    this.isStudentskaSluzba$ = combineLatest([this.authService.isAuthenticated, this.authService.uloge$]).pipe(
      map(([isAuth, uloge]) => isAuth && uloge.includes('studentska_sluzba'))
    );
    
    this.isAdmin$ = combineLatest([this.authService.isAuthenticated, this.authService.uloge$]).pipe(
      map(([isAuth, uloge]) => isAuth && uloge.includes('admin'))
    );
  }

  toggleDrawer(): void {
    this.isDrawerOpened = !this.isDrawerOpened;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/homepage']);
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  openProfileDialog(): void {
    // Dohvatamo ID trenutnog korisnika
    const korisnikId = this.authService.getKorisnikId();
    
    if (korisnikId) {
      // Pozivamo API da dohvatimo kompletne podatke korisnika
      this.korisnikService.getById(korisnikId).subscribe({
        next: (korisnik) => {
          console.log('Loaded user data:', korisnik);
          const config = this.dialogConfigService.getKorisnikConfig(korisnik, false);
          console.log('Dialog config:', config);
          
          const dialogRef = this.dialog.open(GenericDialogComponent, {
            width: '600px',
            data: config
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              // Pozivamo API za ažuriranje korisničkih podataka
              this.korisnikService.patch(korisnikId, result).subscribe({
                next: (updatedKorisnik: any) => {
                  console.log('Korisnik uspešno ažuriran:', updatedKorisnik);
                  alert('Profil je uspešno ažuriran!');
                },
                error: (error: any) => {
                  console.error('Greška pri ažuriranju korisnika:', error);
                  alert('Greška pri ažuriranju profila.');
                }
              });
            }
          });
        },
        error: (error: any) => {
          console.error('Greška pri dohvatanju podataka korisnika:', error);
          alert('Greška pri dohvatanju podataka korisnika.');
        }
      });
    } else {
      alert('Nema podataka o trenutnom korisniku.');
    }
  }
}
