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
    const expectedRoles: string[] = route.data['uloge'];
    console.log('Expected roles:', expectedRoles);

    return this.authService.isAuthenticated.pipe(
      take(1),
      map(isAuth => {
        if (!isAuth) {
          console.log('User not authenticated, redirecting to login');
          this.router.navigate(['/login']);
          return false;
        }

        if (expectedRoles && expectedRoles.length > 0 && !this.authService.hasAnyRole(expectedRoles)) {
          console.log('User does not have required roles, redirecting to home');
          this.router.navigate(['/']);
          return false;
        }

        return true;
      })
    );
  }
}
