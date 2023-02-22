import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Global } from 'src/app/common/global';
import { Observable } from 'rxjs';
import { IUser } from 'src/app/models/IUser';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl=Global.apiURL +"user/details";
  updateUrl=Global.apiURL +"";
  deleteUrl =Global.apiURL +"";
  UsersUrl=Global.apiURL +"users";
  constructor(private http:HttpClient) {}
  UserDetails(id:any)
  {
    const api = `http://hidden-hamlet-75709.herokuapp.com/users/${id}`;
    return this.http.post(api,id);
  }
  updateProfile(usercred:any)
  {
    return this.http.post(this.updateUrl,usercred);
  }
  deletUser (id:any)
  {
    return this.http.post(this.deleteUrl,id);
  }
  getusers():Observable<IUser[]>
  {
    return this.http.get<IUser[]>(this.UsersUrl)
    
  }
}
