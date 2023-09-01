import { Component, OnInit } from '@angular/core';
import { LangService } from '../../Shared/services/lang.service'
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/Shared/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
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
  resetPassword(): void {
    const resetData = {
      uid: this.uid,
      token: this.token,
      new_password: this.restForm.get('password')?.value
    };

    // Make a POST or PUT request to your backend API to reset the password
    this.API.resetPassword(resetData).subscribe(
      response => {
        console.log(response);
        this.showMsg = true
        // Handle success, maybe show a success message
        //this.router.navigate(['/login']); // Redirect to login page
      },
      error => {
        console.error(error);
      if (error.status === 400) {
        this.errorMessage = 'Invalid token or expired link.';
        this.showMsg = false
        this.errorMessage = 'An error occurred while resetting the password.';
      } else {
        this.showMsg = false
        this.errorMessage = 'An error occurred while resetting the password.';
      }
        // Handle error, maybe show an error message
      }
    );
  }
}

