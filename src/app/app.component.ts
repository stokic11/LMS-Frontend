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
import { Observable } from 'rxjs';

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

  @ViewChild('drawer') drawer!: MatSidenav;
  isDrawerOpened = true;

  constructor(private router: Router, private authService: AuthenticationService) {
    this.isAuthenticated$ = this.authService.isAuthenticated;
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
