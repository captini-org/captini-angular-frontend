import { Component, OnInit, OnDestroy } from '@angular/core';
import { SessionService } from './Shared/services/session.service';
import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'CAPTIni';

  constructor(
    private sessionService: SessionService, 
    private translate: TranslateService,
    private router: Router
  ) {
    this.translate.setDefaultLang('icl');
  }

  // Whether the user is currently in a lesson
  inLesson = false;

  ngOnInit(): void {
    this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd),
      map(event => event as NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (event.url.startsWith('/lesson')) {
        // The user is in a lesson, if he navigates to new lesson page, don't end the session
        if (!this.inLesson) {
          // The user entered a lesson and wasn't in one before, so start a new session
          this.sessionService.startSession();
          document.addEventListener("visibilitychange", this.handleVisibilityChange);
          window.addEventListener("beforeunload", this.handleBeforeUnload);
          this.inLesson = true;
        }
      } else {
        if (this.inLesson) {
          // The user just left a lesson to a non-lesson page, so end the session
          this.sessionService.endSession();
          document.removeEventListener("visibilitychange", this.handleVisibilityChange);
          window.removeEventListener("beforeunload", this.handleBeforeUnload);
          this.inLesson = false;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.sessionService.endSession();
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
    window.removeEventListener("beforeunload", this.handleBeforeUnload);
  }

  handleVisibilityChange = (): void => {
    if (document.hidden) {
      this.sessionService.endSession();
    } else {
      this.sessionService.startSession();
    }
  }

  handleBeforeUnload = (): void => {
    this.sessionService.endSession();
  }
}