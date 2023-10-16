import { Component, OnInit } from '@angular/core';
import { LangService } from '../../../../Shared/services/lang.service';
import { UserService } from 'src/app/Shared/services/profile/user.service';
import { IUser } from 'src/app/models/IUser';
import { AuthService } from 'src/app/Shared/services/auth.service';
import { SessionService } from 'src/app/Shared/services/session.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  loading = true;
  Responsedata: any;
  users: any;
  user: any;
  sessionData: any;
  formattedSessionDuration = '';
  learningDays = '';
  LearningHours = '';
  LearningMinutes = '';
  constructor(
    private userService:UserService, 
    private langService: LangService, 
    private sessionService: SessionService, 
    private API: AuthService) { }

  ngOnInit(): void {
    const id = this.API.getUserId();
      if (id != null) {
        // Get the current user's data for the leaderboard and statistics (without session data)
        this.getUser(id);
      }
    this.userService.getusers().subscribe(data=>{
      if (id != null) {
        // Get the session data for the current user
        this.sessionService.getSessionData(id).subscribe(sessionData => {
          this.sessionData = sessionData;

          // Format the session duration to days, hours, and minutes format
          const days = Math.floor(this.sessionData.total_duration / 86400);
          const hours = Math.floor((this.sessionData.total_duration % 86400) / 3600);
          const minutes = Math.floor(((this.sessionData.total_duration % 86400) % 3600) / 60);
          this.LearningHours= hours.toString().padStart(2, '0')
          this.LearningMinutes=minutes.toString().padStart(2, '0')
          this.learningDays=days.toString()
          this.formattedSessionDuration = `${days} days ${hours.toString().padStart(2, '0')} hours ${minutes.toString().padStart(2, '0')} minutes`;
        });
      }

      if (data != null) {
        this.loading = false;
        this.Responsedata = data;
        this.users = this.Responsedata;

        // Set the initial value of showGlow property for each user to false since not everyone is the current user
        this.users.forEach((user: any) => {
          user.showGlow = false;
        });
      }
    });

    const bodyElement = document.body;
    bodyElement.classList.remove('teacher-bird');
  }

  // Function to fetch a specific user
  getUser(id: string) {
    this.userService.UserDetailsCatchError(id!).subscribe(
      (data) => {
        this.user = data;
        // update content according to user specified display language
        // this.langService.useLanguage(this.user.display_language);

        if (this.users) {
          const id = this.API.getUserId();
          const currentUserIndex = this.users.findIndex(
            (user: IUser) => Number(id) === Number(user.id)
          );

          if (currentUserIndex > 2) {
            const currentUser = this.users.splice(currentUserIndex, 1)[0];
            this.users.splice(3, 0, currentUser);
            this.users.forEach((user: any, index: number) => {
              user.showGlow = index === 3; // Highlights the current user in the leaderboard
            });
          }
          this.users = this.users;
          // Limits the number of users to 25
          this.users = this.users.slice(0, 25);
        }
      },
      (error) => {
        throw error;
      }
    );
  }
}
