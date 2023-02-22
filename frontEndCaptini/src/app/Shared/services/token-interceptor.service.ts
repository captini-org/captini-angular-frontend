import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable , Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{
intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  let authService=this.inject.get(AuthService);
 
  let access_token=req.clone({
      setHeaders:{
        Authorization: 'Bearer '+authService.GetToken(),
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    return next.handle(access_token);
    
}
  constructor(private inject:Injector) { }
}
