import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/Shared/services/auth.service';
import { LangService } from 'src/app/Shared/services/lang.service';

@Component({
  selector: 'app-reactivate-account',
  templateUrl: './reactivate-account.component.html',
  styleUrls: ['./reactivate-account.component.css']
})
export class ReactivateAccountComponent implements OnInit {
  public uid?: string;
  public token?: string
  showMsg: boolean = false
  errorMessage: string = ''
  constructor(private langServ: LangService, private route: ActivatedRoute, private http: HttpClient, private router: Router,private API: AuthService) {}
  restForm = new FormGroup({
    password: new FormControl('', [Validators.required]),
  })
  
  get password() {
    return this.restForm.get('password')
  }
  get Rf() {
    return this.restForm.controls
  }
  ngOnInit(): void {
    this.uid= this.route.snapshot.paramMap.get('uid')as string;;
    this.token = this.route.snapshot.paramMap.get('token')as string;;
  }
  switchLang(lang: string) {
    this.langServ.useLanguage(lang)
  }
  check(pass: string, confirmPass: string) {
    if (pass !== confirmPass) {
      return true
    } else {
      return false
    }
  }
  reactivateAccount(): void {
    const reactivateData = {
      uid: this.uid,
      token: this.token,
      new_password: this.restForm.get('password')?.value
    };
    this.API.reactivateAccount(reactivateData).subscribe(
      response => {
        this.showMsg = true;
      },
      error => {
        console.error(error);
      if (error.status === 400) {
        this.errorMessage = 'Invalid token or expired link.';
        this.showMsg = false
        this.errorMessage = 'An error occurred while reactivating the password.';
      } else {
        this.showMsg = false
        this.errorMessage = 'An error occurred while reactivating the password.';
      }
      }
    );
  }
}

 