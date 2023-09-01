import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(private inject: Injector, private route: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authService = this.inject.get(AuthService);
    let authreq = req;
    
    if (authService.GetToken() != null) {
      authreq = this.AddTokenHeader(req, authService.GetToken());
    }

    return next.handle(authreq).pipe(
      catchError((errordata) => {
        if (errordata.status === 401) {
          //return this.refreshToken(req, next);
          
        }
        if (errordata.status === 400) {
          this.route.navigate(['/activate-account']);
          // You need to return an observable here as well to satisfy the return type
          return throwError(errordata); // or return an empty observable
        }
        return throwError(errordata);
      })
    );
  }

  AddTokenHeader(request: HttpRequest<any>, token: any) {
    return request.clone({
      headers: request.headers.set('Content-Type', 'application/json'),
    });
  }

  refreshToken(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authService = this.inject.get(AuthService);
    return authService.GernerateResfreshToken().pipe(
      switchMap((data: any) => {
        authService.SaveToken(data);
        return next.handle(this.AddTokenHeader(request, data.access)).pipe(
          catchError((errordata) => {
            authService.logOut();
            return throwError(errordata);
          })
        );
      }),
      catchError((errordata) => {
        authService.logOut();
        return throwError(errordata);
      })
    );
  }
}
