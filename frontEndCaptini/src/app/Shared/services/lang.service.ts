import { Injectable } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {UserService} from './profile/user.service';
@Injectable({
  providedIn: 'root'
})
export class LangService {
  constructor(private translate: TranslateService,private userService:UserService) {
    translate.setDefaultLang('en');
}
useLanguage(language: string): void {
  this.translate.use(language);
}
}
