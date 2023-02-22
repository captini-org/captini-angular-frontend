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
  msgContent:string='';
  ResponsedataProfile:any;
  user :any;
  constructor(private langService:LangService,private route:Router, private userService:UserService,private formBuilder: FormBuilder) { }
  ngOnInit(): void {
    let id = localStorage.getItem("id");
    this.userService.UserDetails(id).subscribe(result=>{
      if(result!=null)
      {
        this.Responsedata=result;
        this.loading = false;
        this.profilForm.patchValue({
          id:String(this.Responsedata.data.id),
          fullname:String(this.Responsedata.data.fullname),
          username:String(this.Responsedata.data.name),
          email:String(this.Responsedata.data.email),
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
}
