import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Global } from 'src/app/common/global';
import { catchError, Observable, throwError } from 'rxjs';
import { IUser } from 'src/app/models/IUser';
import { AuthService } from 'src/app/Shared/services/auth.service';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl=Global.apiURL +"account/users/";
  updateUrl=Global.apiURL +"account/users/";
  deleteUrl =Global.apiURL +"";
  UsersUrl=Global.apiURL +"account/users/";
  passwordUpdateUrl=Global.apiURL+"api/change-password/"
  constructor(private http:HttpClient,private API:AuthService) {}
  UserDetails(id:string)
  {
    const api = this.apiUrl + `${id}/`;
    return this.http.get(api);
  }
  //With catchError
  UserDetailsCatchError(id: string): Observable<any[]> {
    const api = this.apiUrl + `${id}/`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.API.GetToken()
    });
    return this.http.get<any[]>(api,  { headers })
      .pipe(
        catchError((err) => {
          return throwError(() => new Error('test'));
        })
      )
  }
  updateProfile(usercred:any)
  {

    let id = localStorage.getItem("id");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.API.GetToken()
    });
    const api = this.apiUrl + `${id}/` +  'update/'
    return this.http.patch(api,usercred,{ headers });
  }
  deletUser (id:any)
  {
    return this.http.post(this.deleteUrl,id);
  }
  getusers():Observable<IUser[]>
  {
      let httpOptions = {
          headers: new HttpHeaders({
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + this.API.GetToken()
          })
      };
      return this.http.get<IUser[]>(this.UsersUrl, httpOptions)
  }
  updatePassword(usercred:any)
  {
    return this.http.post(this.passwordUpdateUrl,usercred);
  }
}
