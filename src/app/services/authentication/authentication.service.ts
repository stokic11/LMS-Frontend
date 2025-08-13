import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';
import { AppConstants } from '../../constants';
import { Korisnik } from '../../models/korisnik';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private uloge: string[] = [];
  isAuthenticated= new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    if(typeof localStorage !== 'undefined'){
      this.isAuthenticated.next(!!(localStorage.getItem('token') ?? null));
      const token = localStorage.getItem('token');
      if(token){
        this.setRolesFromToken(token);
      }
    }
   }
   getKorisnikId(){
    return this.getDecodedAccessToken(localStorage.getItem('token') ?? '')["id"];

   }
   hasAnyRole(uloge: string[]): boolean {
    return uloge.some(uloga => this.uloge.includes(uloga));
  }
  setRolesFromToken(token: string): void {
    const decodedToken : any = jwt_decode.jwtDecode(token);
    this.uloge = decodedToken.roles || [];
  }

  getDecodedAccessToken(token:string): any{
    try{
      return jwt_decode.jwtDecode(token);
    }catch(Error){
      console.log(Error);
      return null;
    }
  }
  register(korisnik: Korisnik) {
    console.log(korisnik);
        return this.http.post<any>(`${AppConstants.BASE_URL}auth/signup`, korisnik).pipe(map(token => {
            console.log(token);
            localStorage.setItem('token', token['accessToken']);

            let tokenData = this.getDecodedAccessToken(token['accessToken']);
            this.uloge = tokenData.roles;

            this.isAuthenticated.next(true);

            return token;
        }));

  }
  registerWithoutLogin(korisnik:Korisnik){
    return this.http.post<any>(`${AppConstants.BASE_URL}auth/signup`, korisnik);
  }
  login(email: string , password: string){
    return this.http.post<any>(`${AppConstants.BASE_URL}auth/singin`,{
      "username": email,
      "password": password
    }).pipe(map(token => {
      console.log(token);
      let tokenData = this.getDecodedAccessToken(token['accessToken']);
      this.uloge = tokenData.uloge;
      console.log(tokenData);
      this.isAuthenticated.next(true);
      localStorage.setItem('token', token['accessToken']);
      
      return token;
      }));
    }
    logout() {
        localStorage.removeItem('token');
        this.isAuthenticated.next(false);
        this.uloge = [];
    }


}

