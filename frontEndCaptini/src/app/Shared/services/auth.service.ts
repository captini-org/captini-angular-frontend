import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Global } from 'src/app/common/global';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import * as CryptoJS from 'crypto-js';
const httpoptions = { headers: new HttpHeaders({ Authorization: 'Bearer ' }) };
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = Global.apiURL + 'account/api/token/';
  apiRegister = Global.apiURL + 'account/register/';
  apiLoginForget = Global.apiURL + 'account/api/password-reset/';
  apirefreshToken = Global.apiURL + 'account/api/token/refresh/';
  apiResetPassword = Global.apiURL + 'account/api/password-confirm/';
  apiChangePassword = Global.apiURL + 'account/api/change_password/';
  apiActivatAccount = Global.apiURL + 'account/api/activate_account/';
  apiReactivateAccount = Global.apiURL + 'account/api/reactivate_account/';
  errorMsg: string = '';
  Responsedata: any;
  secretKey: string = 'j3rTA8THW9Qc[t';
  constructor(private http: HttpClient, private route: Router) {}
  loginUser(usercred: any) {
    return this.http.post(this.apiUrl, usercred);
  }

  registerUser(usercred: any) {
    return this.http.post(this.apiRegister, usercred);
  }

  changePassword(combinedFormData: { profilForm: any; passwordForm: any }) {
    return this.http.post(this.apiChangePassword, combinedFormData);
  }

  IsLoggedIn() {
    var expiry = Number(localStorage.getItem('expiry'))
    var state = true;
    if(expiry!= null)
    {
    const expirationTime = expiry * 1000; // Convert to milliseconds
    var state = expirationTime > Date.now();
   }
      // Compare expiration time with current time
      return state && localStorage.getItem('token') != null;
     // return localStorage.getItem('token') != null;
  }

  GetToken() {
    return localStorage.getItem('token') || '';
  }

  GetRefreshToken() {
    return localStorage.getItem('refresh_token') || '';
  }

  GernerateResfreshToken() {
    let input = {
      refresh: this.GetRefreshToken(),
    };
    return this.http.post(this.apirefreshToken, input);
  }

  SaveToken(tokens: any) {
    localStorage.setItem('token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
  }

  loginForget(usercred: any) {
    return this.http.post(this.apiLoginForget, usercred);
  }

  logOut() {
    localStorage.clear();
    this.route.navigate(['login']);
  }
  resetPassword(usercred: any) {
    return this.http.put(this.apiResetPassword, usercred);
  }

  setUserId(userId: string) {
    const encryptedUserId = CryptoJS.AES.encrypt(
      userId,
      this.secretKey
    ).toString();
    localStorage.setItem('id', encryptedUserId);
  }

  getUserId(): string | null {
    // Retrieve the encrypted user ID from local storage
    const encryptedUserId = localStorage.getItem('id');
    if (encryptedUserId) {
      // Decrypt the user ID using the secret key
      const decryptedUserId = CryptoJS.AES.decrypt(
        encryptedUserId,
        this.secretKey
      ).toString(CryptoJS.enc.Utf8);
      return decryptedUserId;
    }
    return null;
  }
  activateAccount(usercred: any) {
    return this.http.post(this.apiActivatAccount, usercred);
  }
  reactivateAccount(usercred: any) {
    return this.http.put(this.apiReactivateAccount, usercred);
  }
  
}
