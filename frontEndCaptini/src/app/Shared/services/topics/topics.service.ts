import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Global } from 'src/app/common/global';
import { ITopics } from 'src/app/models/ITopics';
import { ILesson } from 'src/app/models/ILesson';
import { AuthService } from 'src/app/Shared/services/auth.service';
@Injectable({
  providedIn: 'root',
})
export class TopicsService {
  topicUrl = Global.apiURL + 'captini/topics/';
  lessonUrl = Global.apiURL + 'captini/lessons/';
  searchTopicsUrl = Global.apiURL + 'captini/topics/search/?search=';
  constructor(private httpService: HttpClient, private API: AuthService) {}

  public getTopics(): Observable<ITopics> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'JWT ' + this.API.GetToken(),
      }),
    };

    return this.httpService
      .get<ITopics>(this.topicUrl)
      .pipe(map((data) => new ITopics().deserialize(data)));
  }

  getTopicsById(value: any): Observable<any> {
    const api = this.topicUrl + `${value}/`;
    return this.httpService
      .get<ITopics>(api)
      .pipe(map((data) => new ITopics().deserialize(data)));
  }
  getPromptsByIdLesson(value: any): Observable<any> {
    const api = this.topicUrl + `${value}/`;
    return this.httpService
      .get<ILesson>(api)
      .pipe(map((data) => new ILesson().deserialize(data)));
  }

  public searchTopics(searchPattern: any): Observable<ITopics> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'JWT ' + this.API.GetToken(),
      }),
    };
    var searchTopicsUrl = this.searchTopicsUrl + searchPattern;
    return this.httpService
      .get<ITopics>(searchTopicsUrl)
      .pipe(map((data) => new ITopics().deserialize(data)));
  }
  public searchLessons(topicId: any, searchPattern: any): Observable<ILesson> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'JWT ' + this.API.GetToken(),
      }),
    };
    var searchLessonsUrl =
      this.topicUrl + topicId + '/lessons/search/?search=' + searchPattern;
    return this.httpService
      .get<ITopics>(searchLessonsUrl)
      .pipe(map((data) => new ILesson().deserialize(data)));
  }
}
