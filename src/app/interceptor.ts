import { HttpHandlerFn, HttpRequest } from "@angular/common/http";

export function authInterceptor(req: HttpRequest<any>, next: HttpHandlerFn) {
    if (typeof localStorage !== 'undefined') {
        const token = localStorage.getItem('token');

        if (token && !req.url.endsWith('signin') && !req.url.endsWith('signup')) {
            req = req.clone({
                headers: req.headers.set("Authorization", "Bearer " + token),
            });
        }
    }

    return next(req);
}
