import { Component, OnInit } from '@angular/core';

import {UserService} from 'src/app/Shared/services/profile/user.service'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loading=true ;
  Responsedata: any;
  users: any;

  constructor(private userService:UserService) { }

  ngOnInit(): void {
    this.userService.getusers().subscribe(data=>{
      if(data!=null)
      {
        this.loading = false;
        this.Responsedata=data;
        this.users=this.Responsedata;
      }
    });
    const bodyElement = document.body;
    bodyElement.classList.remove("teacher-bird");
  }

}
