import { Component, OnInit } from '@angular/core';
import { LangService } from '../../../../Shared/services/lang.service';
import {UserService} from 'src/app/Shared/services/profile/user.service'
import { IUser } from 'src/app/models/IUser';
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

  constructor(private userService:UserService, private langService: LangService) { }

  ngOnInit(): void {
    this.userService.getusers().subscribe(data=>{
      const id = localStorage.getItem("id");  // Fetch id of logged in user
      if (id != null) {
        this.getUser(id);  // Fetch specific user
      }

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


// Function to fetch a specific user
getUser(id: string) {
  this.userService.UserDetailsCatchError(id!).subscribe(
    data => {
      this.user = data;
      // update content according to user specified display language
      this.langService.useLanguage(this.user.display_language);

      if (this.users) {
        const id = Number(localStorage.getItem("id"));
        const currentUserIndex = this.users.findIndex((user: IUser) => Number(id) === Number(user.id));

        if (currentUserIndex > 2) {
          const currentUser = this.users.splice(currentUserIndex, 1)[0];
          this.users.splice(3, 0, currentUser);
        }
        this.users = this.users;
        // Limits the number of users to 25
        this.users = this.users.slice(0, 25);
        console.log(this.users);
      }
    },
    (error) => {
      throw error;
    }
  );
}
}

