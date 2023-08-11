import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/Shared/services/auth.service';
import { LangService } from '../../Shared/services/lang.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css'],
})
export class ForgetPasswordComponent implements OnInit {
  Responsedata: any;
  message: boolean = false;
  showMsg: boolean = false
  errorMessage: string = ''
  constructor(
    private langServ: LangService,
    private API: AuthService,
    private route: Router
  ) {}
  switchLang(lang: string) {
    this.langServ.useLanguage(lang);
  }
  ngOnInit(): void {}

  loginForgetForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
  });

  loginForget() {
    this.API.loginForget(this.loginForgetForm.value).subscribe(
    
      response => {
        console.log(response);
        // Handle success, maybe show a success message
        this.route.navigate(['/password-reset']);
      },
      error => {
        console.error(error);
      if (error.status === 400) {
        this.showMsg = true
        this.errorMessage = 'There is no account associated with this email address ';
      } else {
        this.showMsg = true
        this.errorMessage = 'Server error';
      }
        // Handle error, maybe show an error message
      }
    );
  }
}
