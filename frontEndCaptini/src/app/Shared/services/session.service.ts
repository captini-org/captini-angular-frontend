import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Global } from 'src/app/common/global';
import { Observable, catchError } from 'rxjs';
import { throwError } from 'rxjs';
import { AuthService } from 'src/app/Shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private sessionStartTime: number | null = null;
  sessionApiUrl = Global.apiURL + "account/users/session/";

  constructor(private http: HttpClient, private API: AuthService) { }

  /**
   * Starts the session.
   */
  startSession(): void {
    this.sessionStartTime = Date.now();
  }

  /**
   * Ends the session, calculates the duration, and sends it to the backend.
   */
  endSession(): void {
    if (this.sessionStartTime !== null) {
      const sessionEndTime = Date.now();
      const sessionDuration = (sessionEndTime - this.sessionStartTime) / 1000; // duration in seconds
  
      // Send session duration and end time to backend
      this.saveSessionDuration(sessionDuration, sessionEndTime);
  
      this.sessionStartTime = null; // Reset session start time
    }
  }

  /**
   * Gets the session data for the given user.
   * @param userId User ID.
   */
  getSessionData(userId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.API.GetToken()
    });
  
    return this.http.get(this.sessionApiUrl + userId + '/', { headers })
      .pipe(
        catchError((err) => {
          //console.error('Failed to get session data', err);
          return throwError(() => new Error('Failed to get session data'));
        })
      );
  }

  /**
   * Save session duration to backend.
   * @param duration Session duration in seconds.
   */
  private saveSessionDuration(duration: number, endTime: number): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.API.GetToken()
    });
  
    const payload = {
      duration: duration,
      session_end: new Date(endTime).toISOString(),
      user: this.API.getUserId()
    };

    this.http.post(this.sessionApiUrl, payload, { headers })
      .pipe(
        catchError((err) => {
          //console.error('Failed to save session duration', err);
          return throwError(() => new Error('Failed to save session duration'));
        })
      )
      .subscribe(response => {
        //console.log('Session duration saved', response);
      });
  }
}
