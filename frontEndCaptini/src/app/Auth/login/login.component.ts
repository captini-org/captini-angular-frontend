import { Component, OnInit } from '@angular/core';
import {LangService} from '../../Shared/services/lang.service';
import {FormControl,FormGroup, Validators} from '@angular/forms';
import { AuthService } from 'src/app/Shared/services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  Responsedata:any;
  message:boolean = false;
  constructor(private langServ:LangService,private API:AuthService, private route:Router) { 
    
   }
loginForm=new FormGroup(
  {
    username:new FormControl('',[Validators.required]),
    password: new FormControl('',[Validators.required])
  }
);
get username()
{
  return this.loginForm.get('username');
}
get password()
{
  return this.loginForm.get('password');
}
loginUser()
{
  if(this.loginForm.valid)
  {
    this.API.loginUser(this.loginForm.value).subscribe(result=>{
      if(result!=null)
      {
        //console.warn(result);
        this.Responsedata=result;
        localStorage.setItem('token',"25155");
        localStorage.setItem('id',"1")
        this.route.navigate(['']);
      }
    
      
    })
  }

}
 
  
 switchLang(lang:string){
this.langServ.useLanguage(lang);
 }
  ngOnInit(): void {
  }

}
