import { Component, OnInit } from '@angular/core';
import { LangService } from '../../../../Shared/services/lang.service';
import {UserService} from 'src/app/Shared/services/profile/user.service'
import { IUser } from 'src/app/models/IUser';
import { SessionService } from 'src/app/Shared/services/session.service';
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
  sessionData: any;
  formattedSessionDuration = '';

  constructor(private userService:UserService, private langService: LangService, private sessionService: SessionService) { }

  ngOnInit(): void {
    this.userService.getusers().subscribe(data=>{

      const id = localStorage.getItem("id"); // Get the current user's ID

      if (id != null) {
        // Get the current user's data for the leaderboard and statistics (without session data)
        this.getUser(id);

        // Get the session data for the current user
        this.sessionService.getSessionData(id).subscribe(sessionData => {
          this.sessionData = sessionData;

          // Format the session duration to days, hours, and minutes format
          const days = Math.floor(this.sessionData.total_duration / 86400);
          const hours = Math.floor((this.sessionData.total_duration % 86400) / 3600);
          const minutes = Math.floor(((this.sessionData.total_duration % 86400) % 3600) / 60);
          this.formattedSessionDuration = `${days} days ${hours.toString().padStart(2, '0')} hours ${minutes.toString().padStart(2, '0')} minutes`;
        });
      }

      if(data!=null)
      {
        this.loading = false;
        this.Responsedata=data;
        this.users=this.Responsedata;

        // Set the initial value of showGlow property for each user to false since not everyone is the current user
        this.users.forEach((user: any) => {
          user.showGlow = false;
        });
      }
    });

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

      if (this.users) {
        const id = Number(localStorage.getItem("id"));
        // Find the index of the current user in the leaderboard
        const currentUserIndex = this.users.findIndex((user: IUser) => Number(id) === Number(user.id));

        // If the current user is not in the top 3, highlight him in the 4th position in the leaderboard
        // even though he is not ranked in 4th place
        if (currentUserIndex > 2) {
          const currentUser = this.users.splice(currentUserIndex, 1)[0];
          this.users.splice(3, 0, currentUser);
          this.users.forEach((user: any, index: number) => {
            user.showGlow = index === 3; // Highlights the current user in the leaderboard
          });
        }
        this.users = this.users;
        // Limits the number of users shown in the leaderboard to 25
        this.users = this.users.slice(0, 25);
      }
    },
    (error) => {
      throw error;
    }
  );
}
}

