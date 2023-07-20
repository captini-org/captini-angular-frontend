import { Component, OnInit } from '@angular/core';
import { LangService } from '../../../../Shared/services/lang.service';
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
  timeSinceLastLogin: string = "";
  timeSinceRegistration: string = "";

  constructor(private userService:UserService, private langService: LangService) { }

  ngOnInit(): void {
    this.userService.getusers().subscribe(data=>{
      if(data!=null)
      {
        this.loading = false;
        this.Responsedata=data;
        this.users=this.Responsedata;
      }
      // Done so that the time since last login and time since registration are calculated after the user is fetched
      setTimeout(() => {
        this.calculateTimeSinceRegistration();
        this.calculateTimeSinceLastLogin();
      }, 50);
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
      // update content according to user specified display language
      this.langService.useLanguage(this.user.display_language);
    },
    (error) => {
      throw error;
    }
  );
}

calculateTimeSinceLastLogin() {
  const now = new Date();
  
  const lastLogin = this.user.last_login ? new Date(this.user.last_login) : null;

  if (lastLogin) {
    const diffMs = now.getTime() - lastLogin.getTime(); // milliseconds between now & last login

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)); // days
    const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMins = Math.round(((diffMs % (1000 * 60 * 60)) / (1000 * 60)));

    this.timeSinceLastLogin = `${diffDays} days, ${this.pad(diffHrs)} hours, ${this.pad(diffMins)} minutes`;
  } else {
    this.timeSinceLastLogin = "Unknown";
  }
}


calculateTimeSinceRegistration() {
  const now = new Date();
  const dateJoined = this.user.date_joined ? new Date(this.user.date_joined) : null;

  if (dateJoined) {
    const diffMs = now.getTime() - dateJoined.getTime(); // milliseconds between now & date joined

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)); // days
    const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // hours
    const diffMins = Math.round(((diffMs % (1000 * 60 * 60)) / (1000 * 60))); // minutes

    this.timeSinceRegistration = `${diffDays} days ${this.pad(diffHrs)}:${this.pad(diffMins)}`;
  } else {
    this.timeSinceRegistration = "Unknown";
  }
}

pad(num: number): string {
  return ('0'+num).slice(-2);
}
}

