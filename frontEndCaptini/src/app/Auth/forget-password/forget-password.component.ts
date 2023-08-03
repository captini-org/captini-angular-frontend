import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/Shared/services/auth.service';
import { LangService } from '../../Shared/services/lang.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  Responsedata:any;
  message:boolean = false;
  constructor(private langServ:LangService,private API:AuthService, private route:Router, private http: HttpClient) { }

  switchLang(lang:string){
    this.langServ.useLanguage(lang);
  }

  ngOnInit(): void {
  }

  loginForgetForm=new FormGroup(
    {
      email:new FormControl('',[Validators.required])
    }
  );

  loginForget(){
  // Get the email value from the form
  const email = this.loginForgetForm.value.email;

  // Create the request body containing the email
  const requestBody = { email: email };

  // Send the POST request to the backend API
  this.http.post<any>('/account/api/password_reset/', requestBody).subscribe(
    (result) => {
      // Handle the response
      if (result != null) {
        //console.warn(result);
        this.Responsedata = result;
        localStorage.setItem('token', '25155');
        localStorage.setItem('id', this.Responsedata.id);
        this.route.navigate(['/login']);
      }
    },
    (error) => {
      console.log(error);
    });
  }
}
