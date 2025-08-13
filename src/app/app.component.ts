import { Component, ViewChild } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

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

  @ViewChild('drawer') drawer!: MatSidenav;
  isDrawerOpened = true;

  constructor(private router: Router) {}

  toggleDrawer(): void {
    this.isDrawerOpened = !this.isDrawerOpened;
  }

  // Metoda za navigaciju (ako želiš programsku navigaciju)
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
