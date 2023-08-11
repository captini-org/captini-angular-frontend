import { Component, OnInit } from '@angular/core'
import { LangService } from '../../Shared/services/lang.service'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { AuthService } from 'src/app/Shared/services/auth.service'
import { Router } from '@angular/router'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  Responsedata: any
  message: boolean = false
  constructor(private langServ: LangService, private API: AuthService, private route: Router) {}
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  })
  get username() {
    return this.loginForm.get('username')
  }
  get password() {
    return this.loginForm.get('password')
  }
  loginUser() {
    if (this.loginForm.valid) {
      this.API.loginUser(this.loginForm.value).subscribe(
        (result) => {
          this.Responsedata = result;
          localStorage.setItem('token', this.Responsedata.access);
          localStorage.setItem('refresh_token', this.Responsedata.refresh);
          localStorage.setItem('id', this.Responsedata.id);
          let expiry = JSON.parse(window.atob(this.Responsedata.access.split('.')[1])).exp;
          localStorage.setItem('expiry', expiry);

          // Redirect to the desired page upon successful login
          this.route.navigate(['/topics']);
        },
        (error) => {
          // Handle authentication error here
          console.log('Authentication failed. Error:', error);
          this.message = true;
          // Display an error message to the user or perform any necessary actions
        }
      );
    }
  }

  switchLang(lang: string) {
    this.langServ.useLanguage(lang)
  }
  ngOnInit(): void {}
}
