import { Component, OnInit } from '@angular/core';
import { LangService } from 'src/app/Shared/services/lang.service';

@Component({
  selector: 'app-deactivate-account',
  templateUrl: './deactivate-account.component.html',
  styleUrls: ['./deactivate-account.component.css']
})
export class DeactivateAccountComponent implements OnInit {

  constructor(private langServ:LangService) { }

  ngOnInit(): void {
  }
  switchLang(lang: string) {
    this.langServ.useLanguage(lang)
  }
}
