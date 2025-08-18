import { Component, ViewChild } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AuthenticationService } from './services/authentication/authentication.service';
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
    MatIconModule
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

  constructor(private router: Router, private authService: AuthenticationService) {
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
}
