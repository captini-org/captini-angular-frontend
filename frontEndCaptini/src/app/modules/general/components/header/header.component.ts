import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import {UserService} from '../../../../Shared/services/profile/user.service';
import {LangService} from '../../../../Shared/services/lang.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user: any;
  profilePicture:any;
  constructor(private route:Router,private userService:UserService,private langServ:LangService) 
  {
    const id = localStorage.getItem("id");
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
     const id = localStorage.getItem("id");
       
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

  
    
  
  logOUt()
  {
    localStorage.clear();
    this.route.navigate(['login']);
  }
  delete(fileName: string):void
  {
    console.warn("this account was");
    var id = localStorage.getItem("id");
    localStorage.clear();
    this.route.navigate(['login']);
  /* this.userService.deletUser(id).subscribe(result=>{
      if(result!=null)
      {
        localStorage.clear();
        this.route.navigate(['login']);
      }
    })*/

  }
  switchLang(lang:string){
    this.langServ.useLanguage(lang);
     }
     
}
