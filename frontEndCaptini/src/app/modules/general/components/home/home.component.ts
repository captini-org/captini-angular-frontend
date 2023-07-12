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
  user: any;

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

    const id = localStorage.getItem("id");  // Fetch id of logged in user
    if (id != null) {
      this.getUser(id);  // Fetch specific user
    }
    const bodyElement = document.body;
    bodyElement.classList.remove("teacher-bird");
  }

  
// Function to fetch a specific user
getUser(id: string) {
  this.userService.UserDetailsCatchError(id!).subscribe(
    data => {
      this.user = data;
    },
    (error) => {
      throw error;
    }
  );
}
}

