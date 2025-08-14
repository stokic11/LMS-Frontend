import { HttpHandlerFn, HttpRequest } from "@angular/common/http";

export function authInterceptor(req: HttpRequest<any>, next: HttpHandlerFn) {
    // Skip authentication for auth endpoints
    const authEndpoints = ['signin', 'signup', 'login', 'register'];
    const skipAuth = authEndpoints.some(endpoint => req.url.includes(endpoint));
    
    if (typeof localStorage !== 'undefined' && !skipAuth) {
        const token = localStorage.getItem('token');

        if (token) {
            req = req.clone({
                headers: req.headers.set("Authorization", "Bearer " + token),
            });
            console.log('Token added to request:', req.url);
        }
    }

    return next(req);
}
