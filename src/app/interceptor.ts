import { HttpHandlerFn, HttpRequest, HttpErrorResponse } from "@angular/common/http";
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export function authInterceptor(req: HttpRequest<any>, next: HttpHandlerFn) {
    const router = inject(Router);
    
    
    const authEndpoints = ['signin', 'signup', 'login', 'register', 'registracija'];
    
    const publicGetEndpoints = [
        'univerziteti', 'fakulteti', 'studijski-programi', 'godine-studija', 
        'predmeti', 'nastavnici', 'adrese', 'mesta', 'drzave', 
        'nastavni-materijali', 'forumi'
    ];
    
    const isAuthEndpoint = authEndpoints.some(endpoint => req.url.includes(endpoint));
    const isRdfRequest = req.url.includes('/api/rdf/');
    const isPublicGetRequest = req.method === 'GET' && 
                               publicGetEndpoints.some(endpoint => req.url.includes(endpoint)) &&
                               !isRdfRequest;
    
    const skipAuth = isAuthEndpoint || isPublicGetRequest;
    
    
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
            // Only clear token and redirect on 401 (Unauthorized), not 403 (Forbidden)
            // 403 means the token is valid but user lacks permissions
            if (error.status === 401 && !skipAuth) {
                console.log('Authentication error (401), clearing token and redirecting to login');
                localStorage.removeItem('token');
                router.navigate(['/login']);
            } else if (error.status === 403 && !skipAuth) {
                console.log('Forbidden error (403) - insufficient permissions, but token is valid');
                // Don't clear token or redirect on 403 - just log the error
            }
            return throwError(() => error);
        })
    );
}