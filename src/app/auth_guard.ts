import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthenticationService } from './services/authentication/authentication.service';
import { Observable, map, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthenticationService) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const expectedRoles: string[] = route.data['uloge'] || [];

    return this.authService.isAuthenticated.pipe(
      take(1),
      map(isAuth => {
        if (!isAuth) {
          this.router.navigate(['/login']);
          return false;
        }

        if (expectedRoles.length > 0 && !this.authService.hasAnyRole(expectedRoles)) {
          this.router.navigate(['/']);
          return false;
        }

        return true;
      })
    );
  }
}