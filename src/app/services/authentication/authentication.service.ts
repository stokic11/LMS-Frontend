import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { AppConstants } from '../../constants';
import { Korisnik } from '../../models/korisnik';
import { BehaviorSubject } from 'rxjs';

export interface RegistrationRequest {
  korisnickoIme: string;
  email: string;
  password: string;
  ime?: string;
  prezime?: string;
  datumRodjenja?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private uloge: string[] = [];
  isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && this.isTokenValid(token)) {
        this.setRolesFromToken(token);
        this.isAuthenticated.next(true);
      } else {
        localStorage.removeItem('token');
        this.isAuthenticated.next(false);
      }
    }
  }

  private isTokenValid(token: string): boolean {
    try {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  getKorisnikId(): number | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
      const decodedToken = this.getDecodedAccessToken(token);
      return decodedToken?.id || null;
    } catch (error) {
      return null;
    }
  }

  hasAnyRole(uloge: string[]): boolean {
    return uloge.some(uloga => this.uloge.includes(uloga));
  }

  getCurrentUserRoles(): string[] {
    return [...this.uloge];
  }

  setRolesFromToken(token: string): void {
    try {
      const decodedToken: any = jwtDecode(token);
      this.uloge = decodedToken.roles || decodedToken.uloge || [];
      console.log('Roles set from token:', this.uloge);
    } catch (error) {
      console.error('Error decoding token for roles:', error);
      this.uloge = [];
    }
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  register(registrationData: RegistrationRequest) {
    console.log('Registering user:', registrationData);
    return this.http.post<any>(`${AppConstants.BASE_URL}auth/registracija`, registrationData).pipe(
      map(response => {
        console.log('Registration response:', response);
        
        if (response && response.accessToken) {
          localStorage.setItem('token', response.accessToken);
          this.setRolesFromToken(response.accessToken);
          this.isAuthenticated.next(true);
        }
        
        return response;
      })
    );
  }

  registerWithoutLogin(korisnik: Korisnik) {
    return this.http.post<any>(`${AppConstants.BASE_URL}auth/registracija`, korisnik);
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${AppConstants.BASE_URL}auth/login`, {
      "username": email,
      "password": password
    }).pipe(
      map(response => {
        console.log('Login response:', response);
        
        if (response && response.accessToken) {
          localStorage.setItem('token', response.accessToken);
          this.setRolesFromToken(response.accessToken);
          this.isAuthenticated.next(true);
          console.log('User roles after login:', this.uloge);
        }
        
        return response;
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.isAuthenticated.next(false);
    this.uloge = [];
    console.log('User logged out');
  }

  get isCurrentlyAuthenticated(): boolean {
    return this.isAuthenticated.value;
  }
}

