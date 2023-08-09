import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Global } from 'src/app/common/global'
import { Router } from '@angular/router'
import { FormGroup } from '@angular/forms'

const httpoptions = { headers: new HttpHeaders({'Authorization': 'Bearer ' }) }
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = Global.apiURL + 'account/api/token/'
  apiRegister = Global.apiURL + 'account/register/'
  apiLoginForget = Global.apiURL + 'account/api/password-reset/'
  apirefreshToken = Global.apiURL + 'account/api/token/refresh/'
  apiResetPassword  = Global.apiURL + 'account/api/password-confirm/'
  errorMsg: string = ''
  Responsedata: any

  constructor(private http: HttpClient, private route: Router) {}
  loginUser(usercred: any) {
    return this.http.post(this.apiUrl, usercred)
  }
  registerUser(usercred: any) {

    return this.http.post(this.apiRegister, usercred)
  }
  IsLoggedIn() {
    return localStorage.getItem('token') != null
  }
  GetToken() {
    return localStorage.getItem('token') || ''
  }
  GetRefreshToken() {
    return localStorage.getItem('refresh_token') || ''
  }
  GernerateResfreshToken() {
    let input = {
      refresh: this.GetRefreshToken(),
    }
    return this.http.post(this.apirefreshToken, input)
  }
  SaveToken(tokens: any) {
    localStorage.setItem('token', tokens.access)
    localStorage.setItem('refresh_token', tokens.refresh)
  }
  loginForget(usercred: any) {
    return this.http.post(this.apiLoginForget, usercred)
  }
  logOUt() {
    localStorage.clear()
    this.route.navigate(['login'])
  }
  resetPassword(usercred: any) {
    return this.http.put(this.apiResetPassword, usercred)
  }
}
