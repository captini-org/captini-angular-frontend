import { Component, OnInit } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import {UserService} from '../../../../Shared/services/profile/user.service';
import {FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder} from '@angular/forms';
import {LangService} from '../../../../Shared/services/lang.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  Responsedata:any;
  loading = true;
  showMsg: boolean = false;
  errorMessage:string='';
  msgContent:string='';
  ResponsedataProfile:any;
  user :any;
  constructor(private langService:LangService,private route:Router, private userService:UserService,private formBuilder: FormBuilder) { }
  ngOnInit(): void {
    let id = localStorage.getItem("id");
    console.warn(id);
    this.loading = true;
      this.errorMessage = "";
      /*this.userService.UserDetailsCatchError(id!)
        .subscribe(
          () => {                           //Next callback
            console.log('response received', Response)
            this.ResponsedataProfile = Response;
            this.profilForm.patchValue({
              id:String(this.ResponsedataProfile.data.id),
              fullname:String(this.ResponsedataProfile.data.fullname),
              username:String(this.ResponsedataProfile.data.name),
              email:String(this.ResponsedataProfile.data.email),
            });
          },
          (error) => {                              //Error callback
            console.error('error caught in component', error)
            this.errorMessage = error;

            this.loading = false;
  

            throw error;
          }
        )*/
    this.userService.UserDetailsCatchError(id!).subscribe(result=>{
      if(result!=null)
      {
        this.Responsedata=result;
        console.warn(this.Responsedata);
        this.loading = false;
        this.profilForm.patchValue({
          id:String(this.Responsedata.id),
          fullname:String(this.Responsedata.first_name)+" "+ String(this.Responsedata.last_name),
          username:String(this.Responsedata.username),
          email:String(this.Responsedata.email),
        });
      }
    })

   
    const bodyElement = document.body;
    bodyElement.classList.remove("teacher-bird");
  }
  profilForm=this.formBuilder.group(
    {
      id:[''],
      fullname:['jhon deo',Validators.required],
      username:['JHON',Validators.required],
      email:['jhondeo@domaincom',[Validators.required,Validators.email]],
      nativeLang:[''],
      gender:[''],
      yearBirth:[''],
      beginner:['true'],
      intermediate:[''],
      advanced:[''],
      learner:['true'],
      tutor:[''],
      displangEn:['true'],
      displangIcl:[''],
      appNotif:[''],
      emailNotif:['true']
    }
  )
  passwordForm=this.formBuilder.group(
    {
      _oldPass:[''],
      _newPass:['']
    }
  )
  logOUt()
  {
    localStorage.clear();
    this.route.navigate(['login']);
  }
  updateProfil()
  {
    if(this.profilForm.valid)
      {
        this.userService.updateProfile(this.profilForm.value).subscribe(profile=>{
          if(profile!=null)
          {
            this.ResponsedataProfile=profile;
            this.msgContent=this.ResponsedataProfile.message;
            this.showMsg=true;
          }
        })
      }
  }
  changePassword ()
  {
    if(this.passwordForm.valid)
      {
        this.userService.updatePassword(this.profilForm.value).subscribe(password=>{
          if(password!=null)
          {
           
            this.showMsg=true;
          }
        })
      }
  }
}
