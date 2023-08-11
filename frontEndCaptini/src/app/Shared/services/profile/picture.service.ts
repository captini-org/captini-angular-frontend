import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class ProfilePictureService {
  private profilePictureSubject = new Subject<string>();
  profilePicture$ = this.profilePictureSubject.asObservable();

  constructor(private userService: UserService) {}

  updateProfilePicture( userId: any) {
    let Responsedata: any;
    this.userService.UserDetailsCatchError(userId).subscribe((result) => {
      if (result != null) {
        Responsedata= result;
        const timestamp = new Date().getTime(); 
        const picture = Responsedata.profile_photo 
        console.log("-----")
        console.log(picture)
        console.log("-----")
        this.profilePictureSubject.next(picture);

      }
    });
  }
}
