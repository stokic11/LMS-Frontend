import { HttpHandlerFn, HttpRequest, HttpErrorResponse } from "@angular/common/http";
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export function authInterceptor(req: HttpRequest<any>, next: HttpHandlerFn) {
    const router = inject(Router);
    
    
    const authEndpoints = ['signin', 'signup', 'login', 'register', 'registracija'];
    const skipAuth = authEndpoints.some(endpoint => req.url.includes(endpoint));
    
    
    if (typeof localStorage !== 'undefined' && !skipAuth) {
        const token = localStorage.getItem('token');

        if (token) {
            req = req.clone({
                headers: req.headers.set("Authorization", "Bearer " + token),
            });
            console.log('Token added to request:', req.url);
        }
    } else {
        console.log('Skipping auth for:', req.url);
    }

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            
            if ((error.status === 401 || error.status === 403) && !skipAuth) {
                console.log('Authentication error, clearing token and redirecting to login');
                localStorage.removeItem('token');
                router.navigate(['/login']);
            }
            return throwError(() => error);
        })
    );
}