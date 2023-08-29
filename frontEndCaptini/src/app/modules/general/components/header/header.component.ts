import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import {UserService} from '../../../../Shared/services/profile/user.service';
import {LangService} from '../../../../Shared/services/lang.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Shared/services/auth.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user: any;
  profilePicture:any;
  constructor(private route:Router,private userService:UserService,private langServ:LangService,private API: AuthService) 
  {
    let id = this.API.getUserId();
    this.userService.UserDetailsCatchError(id!).subscribe(
      data => {
        this.user = data;
        this.profilePicture = this.user.profile_photo;
      },
      (error) => {
        throw error;
      }
    );
  }
  @Input() isOpen = false;
  @Output() closed = new EventEmitter();
  close() {
    this.closed.emit();
  }

  ngOnInit(): void {
     let id = this.API.getUserId();
     this.userService.UserDetailsCatchError(id!).subscribe(
      data => {
        this.user = data;
        this.profilePicture = this.user.profile_photo;
      },
      (error) => {
        throw error;
      }
    );
    }

  
    
  
  logOut()
  {
    localStorage.clear();
    this.route.navigate(['login']);
  }
  delete():void
  {
   let id = this.API.getUserId();
   this.userService.dactivateUser(id).subscribe(result=>{
      if(result!=null)
      {
        localStorage.clear();
        this.route.navigate(['deactivate-account']);
      }
    })

  }
  switchLang(lang:string){
    this.langServ.useLanguage(lang);
     }
     
}
