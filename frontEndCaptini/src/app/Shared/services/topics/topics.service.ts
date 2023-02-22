import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Global } from 'src/app/common/global';
import { ITopics } from 'src/app/models/ITopics';

@Injectable({
  providedIn: 'root'
})
export class TopicsService {
  topicUrl=Global.apiURL +"topics/";
  constructor(private httpService:HttpClient) { }

  public getTopics(): Observable<ITopics> {
    return this.httpService.get<ITopics>(this.topicUrl).pipe(
      map(data => new ITopics().deserialize(data))
    );
  }
 
  getTopicsById(value:any):Observable<any>{
    const api = `http://hidden-hamlet-75709.herokuapp.com/topics/${value}`;
    return this.httpService.get<ITopics>(api).pipe(
      map(data => new ITopics().deserialize(data))
    );
  }
}
