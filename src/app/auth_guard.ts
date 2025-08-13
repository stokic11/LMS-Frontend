import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './services/authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {


  constructor(private router: Router, private authService: AuthenticationService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles: string[] = route.data['roles'];
    console.log(expectedRoles)

    if (!this.authService.isAuthenticated) {
      this.router.navigate(['/']);
      return false;
    }

    if (expectedRoles && !this.authService.hasAnyRole(expectedRoles)) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
