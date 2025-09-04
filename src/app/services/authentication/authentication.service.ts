import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
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

export interface LoginRequest {
  korisnickoIme: string;
  lozinka: string;
}

export interface AuthResponse {
  token: string;
  user?: any;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private uloge: string[] = [];
  private currentUserSubject = new BehaviorSubject<any>(null);
  private rolesSubject = new BehaviorSubject<string[]>([]);
  public currentUser = this.currentUserSubject.asObservable();
  public uloge$ = this.rolesSubject.asObservable();
  public isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && this.isTokenValid(token)) {
        this.setRolesFromToken(token);
        this.setCurrentUserFromToken(token);
        this.isAuthenticated.next(true);
      } else {
        localStorage.removeItem('token');
        this.isAuthenticated.next(false);
        this.rolesSubject.next([]);
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

  private setCurrentUserFromToken(token: string): void {
    try {
      const decodedToken = this.getDecodedAccessToken(token);
      this.currentUserSubject.next(decodedToken);
    } catch (error) {
      console.error('Error setting user from token:', error);
      this.currentUserSubject.next(null);
    }
  }

  getKorisnikId(): number | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
      const decodedToken = this.getDecodedAccessToken(token);
      return decodedToken?.id || decodedToken?.sub || null;
    } catch (error) {
      console.error('Error getting user ID:', error);
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
      this.uloge = decodedToken.uloge || [];
      this.rolesSubject.next(this.uloge);
      console.log('Roles set from token:', this.uloge);
    } catch (error) {
      console.error('Error decoding token for roles:', error);
      this.uloge = [];
      this.rolesSubject.next([]);
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

  getToken(): string | null {
    return typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
  }

  register(registrationData: RegistrationRequest) {
    console.log('Registering user:', registrationData);
    
    
    const backendPayload = {
      korisnickoIme: registrationData.korisnickoIme,
      email: registrationData.email,
      lozinka: registrationData.password,  
      ime: registrationData.ime,
      prezime: registrationData.prezime,
      datumRodjenja: registrationData.datumRodjenja
    };
    
    return this.http.post<AuthResponse>(`${AppConstants.BASE_URL}auth/registracija`, backendPayload).pipe(
      map(response => {
        console.log('Registration response:', response);
        
        
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          this.setRolesFromToken(response.token);
          this.setCurrentUserFromToken(response.token);
          this.isAuthenticated.next(true);
        }
        
        return response;
      }),
      catchError(error => {
        console.error('Registration error:', error);
        return throwError(() => error);
      })
    );
  }

  registerWithoutLogin(korisnik: Korisnik) {
    return this.http.post<any>(`${AppConstants.BASE_URL}auth/registracija`, korisnik).pipe(
      catchError(error => {
        console.error('Registration without login error:', error);
        return throwError(() => error);
      })
    );
  }

  login(korisnickoIme: string, lozinka: string) {
    const loginPayload: LoginRequest = {
      korisnickoIme: korisnickoIme,
      lozinka: lozinka
    };

    return this.http.post<AuthResponse>(`${AppConstants.BASE_URL}auth/login`, loginPayload).pipe(
      map(response => {
        console.log('Login response:', response);
        
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          this.setRolesFromToken(response.token);
          this.setCurrentUserFromToken(response.token);
          this.isAuthenticated.next(true);
          console.log('User roles after login:', this.uloge);
        } else {
          throw new Error('Invalid login response - no token received');
        }
        
        return response;
      }),
      catchError(error => {
        console.error('Login error:', error);
        this.logout(); 
        return throwError(() => error);
      })
    );
  }

  logout() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
    }
    this.isAuthenticated.next(false);
    this.currentUserSubject.next(null);
    this.uloge = [];
            this.rolesSubject.next([]);
    console.log('User logged out');
  }

  get isCurrentlyAuthenticated(): boolean {
    return this.isAuthenticated.value;
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  refreshToken(): void {
    const token = this.getToken();
    if (token && this.isTokenValid(token)) {
      this.setRolesFromToken(token);
      this.setCurrentUserFromToken(token);
      this.isAuthenticated.next(true);
    } else {
      this.logout();
    }
  }

  
  hasRole(role: string): boolean {
    return this.uloge.includes(role);
  }

  
  isLoggedIn(): boolean {
    const token = this.getToken();
    return token ? this.isTokenValid(token) : false;
  }
}