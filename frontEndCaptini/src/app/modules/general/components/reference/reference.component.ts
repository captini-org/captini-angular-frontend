import { Component, OnInit } from '@angular/core';
import { LangService } from 'src/app/Shared/services/lang.service';

@Component({
  selector: 'app-reference',
  templateUrl: './reference.component.html',
  styleUrls: ['./reference.component.css']
})
export class ReferenceComponent implements OnInit {

  constructor(private langServ: LangService) { }
  switchLang(lang: string) {
    this.langServ.useLanguage(lang)
  }
  ngOnInit(): void {
  }

}
