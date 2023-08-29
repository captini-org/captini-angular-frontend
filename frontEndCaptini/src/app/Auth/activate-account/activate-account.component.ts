import { Component, OnInit } from '@angular/core';
import { LangService } from '../../Shared/services/lang.service'
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/Shared/services/auth.service';
@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.css']
})
export class ActivateAccountComponent implements  OnInit {
  Responsedata: any;
  successMessage: boolean = false;
  showMsg: boolean = false;
  errorMessage: string = ''
  constructor(
    private langServ: LangService,
    private API: AuthService,
    private route: Router,
    private http: HttpClient
  ) {}
  switchLang(lang: string) {
    this.langServ.useLanguage(lang);
  }
  ngOnInit(): void {}

  activateAccountForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
  });

  activateAccount() {
    this.API.activateAccount(this.activateAccountForm.value).subscribe(

      response => {
        console.log(response);
        // Handle success, maybe show a success message
        //this.route.navigate(['/password-reset']);
        this.successMessage = true;
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
