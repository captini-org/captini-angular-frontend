import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Global } from 'src/app/common/global';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl=Global.apiURL +"users/login/";
  apiRegister=Global.apiURL +"users/signup/"
  errorMsg: string="";
  constructor(private http:HttpClient) { }
  loginUser(usercred:any)
  {
    return this.http.post(this.apiUrl,usercred);
  }
  registerUser(usercred:any)
  {
    return this.http.post(this.apiRegister,usercred);
  }
  IsLoggedIn()
  {
    return localStorage.getItem('token')!=null;
  }
  GetToken()
  {
    return localStorage.getItem('token')||'';
  }
}
