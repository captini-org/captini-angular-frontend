import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from '../services/auth.service'
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private API:AuthService,private route:Router)
  {}
  canActivate(){
    if(this.API.IsLoggedIn()){
      return true;
    }
    else 
    {
      this.route.navigate(['login']);
      return false;

    }
    
  }
  
}
