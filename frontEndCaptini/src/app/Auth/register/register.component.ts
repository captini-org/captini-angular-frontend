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
import { ActivatedRoute, Router } from '@angular/router'
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [DatePipe],
})
export class RegisterComponent implements OnInit {
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
    location: ['', Validators.required],
    birthday: [''],
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
  }
  register() {
    if (this.registerForm.valid) {
      this.API.registerUser(this.registerForm.value).subscribe((result) => {
        if (result != null) {
          this.msgContent = this.Responsedata
          this.showMsg = true
          //this.navigate.navigate(['/login',]);
        }
      },
      (error) => {
        // Handle registration error here
        alert('verify your data')
        // Display an error message to the user or perform any necessary actions
      })
    
    }
  }
  getYearOptions(): number[] {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 120; // Adjust the range as needed
    const endYear = currentYear - 4; // Adjust the range as needed

    // Generate an array of years in descending order
    return Array.from({ length: endYear - startYear + 1 }, (_, index) => endYear - index);
  }
  ngOnInit(): void {}
}
