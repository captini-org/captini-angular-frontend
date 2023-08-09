import { Component, OnInit } from '@angular/core';
import { LangService } from 'src/app/Shared/services/lang.service';
@Component({
  selector: 'app-reset-sucess',
  templateUrl: './reset-sucess.component.html',
  styleUrls: ['./reset-sucess.component.css']
})
export class ResetSucessComponent implements OnInit {

  constructor(private langServ: LangService ) { }

  ngOnInit(): void {
  }
  switchLang(lang: string) {
    this.langServ.useLanguage(lang)
  }
}
