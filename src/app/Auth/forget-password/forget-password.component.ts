import { Component, OnInit } from '@angular/core';
import {FormControl,FormGroup, Validators} from '@angular/forms';
import { AuthService } from 'src/app/Shared/services/auth.service';
import {LangService} from '../../Shared/services/lang.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  Responsedata:any;
  message:boolean = false;
  constructor(private langServ:LangService,private API:AuthService, private route:Router) { }
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

  loginForget()
{
 
  
    this.API.loginForget(this.loginForgetForm.value).subscribe(result=>{
    

      if(result!=null)
      {
        //console.warn(result);
        this.Responsedata=result;
        localStorage.setItem('token',"25155");
        localStorage.setItem('id',this.Responsedata.id)
        this.route.navigate(['/login']);
      }
    })
  

}

}
