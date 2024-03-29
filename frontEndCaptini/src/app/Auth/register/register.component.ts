import { Component, OnInit } from '@angular/core'
import { DatePipe } from '@angular/common'
import { LangService } from '../../Shared/services/lang.service'
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormGroup,
  FormBuilder,
} from '@angular/forms'

import { AuthService } from 'src/app/Shared/services/auth.service'
import { HttpHeaders } from '@angular/common/http'
import { ActivatedRoute, Router, Routes } from '@angular/router'
import { PrivacyPolicyComponent } from './policies/privacypolicy.component'
import { TermsOfUseComponent } from './policies/termsofuse.component'
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [DatePipe],
})
export class RegisterComponent implements OnInit {

  is_icelandic: boolean = false
  showMsg: boolean = false
  msgContent: string = ''
  Responsedata: any
  isChecked = true
  loading: boolean = false
  errorMessage: string = ''
  check(pass: string, confirmPass: string) {
    if (pass !== confirmPass) {
      return true
    } else {
      return false
    }
  }
/*
{
    "username": "testUser2",
    "email": "testari+1@tiro.is",
    "password": "testUser3",
    "password2": "testUser3"
}

*/
  registerForm = this.formBuilder.group({
    username: ['', [Validators.required, Validators.max(150)]],
    first_name: [''],
    last_name: [''],
    nationality: ['', Validators.required],
    birthyear: ['', Validators.required],
    email: ['', [Validators.email, Validators.required]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(
          '(?=.{8,})(?=.*?[*.!@$%^&(){}[:;<>,.?/~_+=|])(?=.*?[^ws])(?=.*?[0-9])(?=.*?[A-Z]).*?[a-z].*'
        ),
      ],
    ],
    password2: ['', Validators.required],
    agree: ['', Validators.required],
  })
  get Rf() {
    return this.registerForm.controls
  }

  constructor(
    private langService: LangService,
    private formBuilder: FormBuilder,
    private API: AuthService,
    private navigate:Router
  ) {}

  switchLang(lang: string) {
    this.langService.useLanguage(lang)
    this.is_icelandic = !this.is_icelandic
  }

  register() {
    if (this.registerForm.valid) {
      this.API.registerUser(this.registerForm.value).subscribe(
        (result) => {
          if (result != null) {
            var responseResult = result as { username: string }
            if (responseResult.username != "user with this username already exists.") {
              this.msgContent = this.Responsedata
              this.showMsg = true
            } else {
              this.showMsg = false
              alert('Username already exists!')
            }
          }
        },
        (error) => {
          // Handle registration error here
          alert('Email is already registered!')
          // Display an error message to the user or perform any necessary actions
        }
      );
    }
  }

  ngOnInit(): void {
    const routes: Routes = [
      { path: 'privacypolicy', component: PrivacyPolicyComponent },
      { path: 'termsofuse', component: TermsOfUseComponent }
      //{ path: 'terms-and-condition', component: TermsAndConditionsComponent },
    ];

  }
}
